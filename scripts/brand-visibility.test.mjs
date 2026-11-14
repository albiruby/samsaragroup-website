import test from "node:test";
import assert from "node:assert/strict";
import { isBrandHidden } from "../src/lib/brand-visibility.mjs";

/**
 * Regression tests for F-01 from the security audit run 3: the page body and the
 * metadata generator must agree on whether a brand is public.
 */

test("CMS unreachable (no document) is not hidden", () => {
  assert.equal(isBrandHidden(null), false);
  assert.equal(isBrandHidden(undefined), false);
});

test("published brand is visible", () => {
  assert.equal(isBrandHidden({ status: "active", featured: true }), false);
  // `featured` is optional and defaults to visible.
  assert.equal(isBrandHidden({ status: "active" }), false);
});

test("draft and archived documents are hidden", () => {
  assert.equal(isBrandHidden({ status: "draft", featured: true }), true);
  assert.equal(isBrandHidden({ status: "archived", featured: true }), true);
});

test("a document without status is hidden, matching the body gate", () => {
  assert.equal(isBrandHidden({ featured: true }), true);
  assert.equal(isBrandHidden({ status: "", featured: true }), true);
});

test("featured false hides an otherwise active brand", () => {
  assert.equal(isBrandHidden({ status: "active", featured: false }), true);
});
