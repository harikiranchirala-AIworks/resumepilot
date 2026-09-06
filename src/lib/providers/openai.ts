import OpenAI from "openai";
import { parseAgentJson } from "../parse-agent-json";

export function getOpenAIApiKey(): string | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key || key.startsWith("sk-your")) return null;
  return key;
}

export function hasOpenAI(): boolean {
  return getOpenAIApiKey() !== null;
}

function getClient(): OpenAI | null {
  const key = getOpenAIApiKey();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export async function callOpenAIApi<T>(prompt: string, systemPrompt?: string): Promise<T> {
  const client = getClient();
  if (!client) {
    throw new Error("OPENAI_API_KEY is not configured in .env.local");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty response from OpenAI API");

  return parseAgentJson<T>(raw);
}
