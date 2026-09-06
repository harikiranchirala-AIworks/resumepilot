import { parseAgentJson } from "../parse-agent-json";

export function getAnthropicApiKey(): string | null {
  const key = process.env.ANTHROPIC_API_KEY?.trim() || process.env.CLAUDE_API_KEY?.trim();
  if (!key || key.startsWith("sk-ant-your") || key.startsWith("your_")) return null;
  return key;
}

export function hasAnthropic(): boolean {
  return getAnthropicApiKey() !== null;
}

export async function callAnthropicApi<T>(prompt: string, systemPrompt?: string): Promise<T> {
  const apiKey = getAnthropicApiKey();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured in .env.local");
  }

  const model = process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022";
  const url = "https://api.anthropic.com/v1/messages";

  const payload: Record<string, unknown> = {
    model,
    max_tokens: 4096,
    temperature: 0.3,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  if (systemPrompt) {
    payload.system = systemPrompt;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  const text = data?.content?.[0]?.text;
  if (!text) {
    throw new Error("Empty response from Anthropic API");
  }

  return parseAgentJson<T>(text);
}
