import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const root = new URL("..", import.meta.url).pathname;

test("OpenRouter retains guarded asynchronous video generation", async () => {
  const skill = await readFile(join(root, "skills", "video-generation", "SKILL.md"), "utf8");
  assert.match(skill, /POST \/api\/v1\/videos/);
  assert.match(skill, /can spend credits/);
  assert.match(skill, /authorized the exact model/);
  assert.match(skill, /do not automatically resubmit/);
});
