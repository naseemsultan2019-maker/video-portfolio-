const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("index.html has a title", () => {
  assert.match(html, /<title>[^<]+<\/title>/);
});

test("local src/href references point to existing files", () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((r) => !/^(https?:|mailto:|tel:|#|data:|\/\/)/.test(r));
  for (const ref of refs) {
    assert.ok(fs.existsSync(path.join(root, ref)), `missing file: ${ref}`);
  }
});
