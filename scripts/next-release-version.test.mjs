import assert from "node:assert/strict";
import { test } from "node:test";
import { nextReleaseVersion } from "./next-release-version.mjs";

test("advances past registry versions when the repository version is stale", () => {
  assert.equal(nextReleaseVersion("0.3.16", ["0.3.17", "0.3.18"]), "0.3.19");
});

test("compares versions numerically regardless of registry order", () => {
  assert.equal(nextReleaseVersion("0.3.9", ["0.3.10", "0.3.9", "0.3.18"]), "0.3.19");
  assert.equal(nextReleaseVersion("0.3.16", ["1.0.0", "0.99.99"]), "1.0.1");
});

test("preserves a repository version ahead of the registry", () => {
  assert.equal(nextReleaseVersion("0.4.0", ["0.3.18"]), "0.4.1");
});

test("accepts a single registry version and ignores prerelease versions", () => {
  assert.equal(nextReleaseVersion("0.3.16", "0.3.18"), "0.3.19");
  assert.equal(nextReleaseVersion("0.3.16", ["0.3.18", "1.0.0-beta.1"]), "0.3.19");
});

test("fails explicitly for missing or invalid registry data", () => {
  for (const versions of [null, [], {}, [18], ["invalid"]]) {
    assert.throws(() => nextReleaseVersion("0.3.16", versions));
  }
  assert.throws(() => nextReleaseVersion("invalid", ["0.3.18"]));
});
