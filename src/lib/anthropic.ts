import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY tanımlı değil (bkz. .env.example).");
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const AI_REVISE_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
