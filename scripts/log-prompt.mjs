// Prompt-submit hook shared by Claude Code, Codex and Antigravity.
// Usage: node scripts/log-prompt.mjs <claude|codex|antigravity>  (hook payload on stdin)
// Appends the human-written prompt to .prompt-log/<tool>/<session>.jsonl.
// Agent output is not copied; transcript_path points to the full session record.
// Must never block the prompt, so every failure exits 0.
import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const TOOLS = new Set(["claude", "codex", "antigravity"]);

function git(cwd, args) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

// Map each tool's payload to one shape. Antigravity uses camelCase and has no cwd.
function normalize(tool, input) {
  if (tool === "antigravity") {
    return {
      session_id: input.conversationId,
      transcript_path: input.transcriptPath ?? null,
      cwd: input.workspacePaths?.[0] ?? process.cwd(),
      model: input.modelName ?? null,
      prompt: input.lastUserInput,
    };
  }
  return {
    session_id: input.session_id,
    turn_id: input.turn_id,
    transcript_path: input.transcript_path ?? null,
    cwd: input.cwd ?? process.cwd(),
    model: input.model ?? null,
    prompt: input.prompt,
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

  const event = normalize(tool, JSON.parse(readFileSync(0, "utf8")));
  if (!event.session_id || typeof event.prompt !== "string") process.exit(0);

  const root = process.env.CLAUDE_PROJECT_DIR || git(event.cwd, ["rev-parse", "--show-toplevel"]) || event.cwd;
  const dir = join(root, ".prompt-log", tool);
  const file = join(dir, `${String(event.session_id).replace(/[^\w.-]/g, "_")}.jsonl`);

  // Antigravity's PreInvocation fires on every model call, so skip repeats of the same prompt.
  if (tool === "antigravity" && lastLoggedPrompt(file) === event.prompt) process.exit(0);

  mkdirSync(dir, { recursive: true });
  const entry = {
    timestamp: new Date().toISOString(),
    tool,
    ...event,
    branch: git(event.cwd, ["rev-parse", "--abbrev-ref", "HEAD"]),
    commit: git(event.cwd, ["rev-parse", "--short", "HEAD"]),
  };
  appendFileSync(file, JSON.stringify(entry) + "\n", "utf8");

  // Claude Code and Codex add stdout to the agent's context, so the agent can cite its session in commits.
  if (tool !== "antigravity") process.stdout.write(`Prompt log session: ${tool}/${event.session_id}\n`);
} catch {
  // Logging is best-effort.
}
process.exit(0);
