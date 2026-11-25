// Prompt-submit hook shared by Claude Code, Codex and Antigravity.
// Usage: node scripts/log-prompt.mjs <claude|codex|antigravity>  (hook payload on stdin)
// Prompts go to .prompt-log/<tool>/<session>.jsonl.
// Claude entries include transcript_path for reviewing session context.
// Agent output is not copied. Must never block the prompt, so every failure exits 0.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";

const TOOLS = new Set(["claude", "codex", "antigravity"]);

function git(cwd, args) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

// Antigravity uses camelCase fields and has no cwd.
function readPayload(tool, input) {
  if (tool === "antigravity") {
    return {
      cwd: input.workspacePaths?.[0] ?? process.cwd(),
      prompt: input.lastUserInput,
      session_id: input.conversationId,
    };
  }
  return {
    cwd: input.cwd ?? process.cwd(),
    prompt: input.prompt,
    session_id: input.session_id,
    transcript_path: input.transcript_path ?? null,
  };
}

function lastLoggedPrompt(file) {
  if (!existsSync(file)) return null;
  const lines = readFileSync(file, "utf8").trimEnd().split("\n");
  try {
    return JSON.parse(lines[lines.length - 1]).prompt;
  } catch {
    return null;
  }
}

try {
  const tool = process.argv[2];
  if (!TOOLS.has(tool)) process.exit(0);

  const { cwd, prompt, session_id, transcript_path } = readPayload(tool, JSON.parse(readFileSync(0, "utf8")));
  if (!session_id || typeof prompt !== "string") process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || git(cwd, ["rev-parse", "--show-toplevel"]) || cwd;
  const file = join(root, ".prompt-log", tool, `${String(session_id).replace(/[^\w.-]/g, "_")}.jsonl`);

  // Antigravity's PreInvocation fires on every model call, so skip repeats of the same prompt.
  if (tool === "antigravity" && lastLoggedPrompt(file) === prompt) process.exit(0);

  const entry = { timestamp: new Date().toISOString(), tool };
  if (tool === "claude") Object.assign(entry, { session_id, transcript_path });
  Object.assign(entry, {
    cwd,
    branch: git(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]),
    commit: git(cwd, ["rev-parse", "--short", "HEAD"]),
    prompt,
  });

  mkdirSync(dirname(file), { recursive: true });
  appendFileSync(file, JSON.stringify(entry) + "\n", "utf8");

  // Claude Code adds stdout to the agent's context, so the agent can cite its session in commits.
  if (tool === "claude") process.stdout.write(`Prompt log session: claude/${session_id}\n`);
} catch {
  // Logging is best-effort.
}
process.exit(0);
