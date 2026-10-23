#!/usr/bin/env node
/**
 * Vercel ignoreCommand: exit 0 = skip build, exit 1 = build.
 *
 * Compare against the last successfully deployed commit when Vercel provides it,
 * so a push with several commits cannot hide a code change behind a docs-only
 * commit. If that SHA is gone (force push / shallow clone), build instead of
 * failing the deployment.
 */
import { execFileSync } from "node:child_process";

const base = process.env.VERCEL_GIT_PREVIOUS_SHA || "HEAD^";

const paths = [
  "src",
  "public",
  "scripts",
  "package.json",
  "package-lock.json",
  "next.config.mjs",
  "vercel.json",
  "postcss.config.mjs",
  "jsconfig.json",
  "tsconfig.json",
];

function git(args) {
  try {
    execFileSync("git", args, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// A missing base (force push, shallow clone, first commit) must build, not fail.
if (!git(["cat-file", "-e", `${base}^{commit}`])) process.exit(1);

// `git diff --quiet` exits 1 when the paths differ; that means build.
process.exit(git(["diff", "--quiet", base, "HEAD", "--", ...paths]) ? 0 : 1);
