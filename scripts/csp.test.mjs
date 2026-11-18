import test from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";

// proxy.js imports "next/server", which Next's bundler resolves but plain Node's
// ESM loader does not (the package has no "exports" map). Point it at the file.
registerHooks({
  resolve(specifier, context, next) {
    return next(specifier === "next/server" ? "next/server.js" : specifier, context);
  },
});

const { proxy } = await import("../src/proxy.js");

function run(path = "/samsara") {
  const response = proxy(new Request(`https://example.test${path}`));
  const csp = response.headers.get("content-security-policy");
  const directives = Object.fromEntries(
    csp.split(";").map((d) => {
      const [name, ...values] = d.trim().split(/\s+/);
      return [name, values];
    })
  );
  return { response, csp, directives };
}

function withNodeEnv(value, fn) {
  const before = process.env.NODE_ENV;
  process.env.NODE_ENV = value;
  try {
    return fn();
  } finally {
    if (before === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = before;
  }
}

test("production CSP keeps the hardening directives", () => {
  withNodeEnv("production", () => {
    const { directives } = run();
    assert.deepEqual(directives["default-src"], ["'self'"]);
    assert.deepEqual(directives["object-src"], ["'none'"]);
    assert.deepEqual(directives["base-uri"], ["'self'"]);
    assert.deepEqual(directives["form-action"], ["'self'"]);
    assert.deepEqual(directives["frame-ancestors"], ["'none'"]);
    assert.ok("upgrade-insecure-requests" in directives);
  });
});

test("production script-src is nonce + strict-dynamic, never unsafe-*", () => {
  withNodeEnv("production", () => {
    const script = run().directives["script-src"];
    assert.ok(script.includes("'strict-dynamic'"));
    assert.ok(script.some((v) => /^'nonce-[A-Za-z0-9+/=]+'$/.test(v)));
    assert.ok(!script.includes("'unsafe-inline'"));
    assert.ok(!script.includes("'unsafe-eval'"));
  });
});

test("unsafe-eval is only added in development", () => {
  withNodeEnv("development", () => {
    assert.ok(run().directives["script-src"].includes("'unsafe-eval'"));
  });
});

test("every request gets a fresh nonce, and the page receives the same one", () => {
  withNodeEnv("production", () => {
    const a = run();
    const b = run();
    const nonceOf = (csp) => csp.match(/'nonce-([^']+)'/)[1];
    assert.notEqual(nonceOf(a.csp), nonceOf(b.csp));

    // NextResponse.next({ request: { headers } }) forwards overridden request
    // headers as x-middleware-request-*; layout.js reads x-nonce from there.
    const forwarded = a.response.headers.get("x-middleware-request-x-nonce");
    assert.equal(forwarded, nonceOf(a.csp));
  });
});

test("image and connect sources stay limited to the hosts the site uses", () => {
  withNodeEnv("production", () => {
    const { directives } = run();
    assert.deepEqual(directives["img-src"], [
      "'self'", "data:", "blob:", "https://cdn.sanity.io", "https://*.tile.openstreetmap.org",
    ]);
    assert.deepEqual(directives["connect-src"], ["'self'", "https://*.sanity.io"]);
  });
});
