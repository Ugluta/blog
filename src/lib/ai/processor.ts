// AI content processor — routes to the configured provider for each task.
// Supported providers: Claude, GPT-4, Gemini, Grok, DeepSeek
// Tasks: rewrite | translate | summarize | categorize | generate_hashtags

export type AIProvider = "Claude" | "GPT-4" | "Gemini" | "Grok" | "DeepSeek";
export type AITask = "rewrite" | "translate" | "summarize" | "categorize" | "generate_hashtags";

export interface ProcessInput {
  title: string;
  content: string;
  url?: string;
  targetLanguage?: string;
  targetCategory?: string;
}

export interface ProcessResult {
  title: string;
  content: string;
  summary?: string;
  hashtags?: string[];
  category?: string;
  provider: AIProvider;
}

function buildPrompt(task: AITask, input: ProcessInput): string {
  const source = `Başlık: ${input.title}\n\nİçerik:\n${input.content.slice(0, 4000)}`;

  switch (task) {
    case "rewrite":
      return `Aşağıdaki haber metnini Türkçe olarak yeniden yaz. Orijinal bilgileri koru, ancak ifadeyi farklılaştır. Sadece yeniden yazılmış metni döndür, açıklama ekleme.\n\n${source}`;
    case "translate":
      return `Aşağıdaki metni ${input.targetLanguage ?? "Türkçe"} diline çevir. Sadece çeviriyi döndür.\n\n${source}`;
    case "summarize":
      return `Aşağıdaki haberi 2-3 cümleyle özetle. Sadece özeti döndür.\n\n${source}`;
    case "categorize":
      return `Aşağıdaki haberi şu kategorilerden birine ata: Teknoloji, Ekonomi, Spor, Sağlık, Dünya, Kültür, Genel. Sadece kategori adını döndür.\n\n${source}`;
    case "generate_hashtags":
      return `Aşağıdaki haber için 5-10 Instagram/Twitter hashtag'i üret. # işaretiyle başlayan, virgülle ayrılmış liste olarak döndür.\n\n${source}`;
    default:
      return source;
  }
}

async function callClaude(prompt: string): Promise<string> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });
  const block = msg.content[0];
  return block.type === "text" ? block.text : "";
}

async function callGPT4(prompt: string): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function callGemini(prompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callGrok(prompt: string): Promise<string> {
  // Grok uses OpenAI-compatible API
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/v1",
  });
  const completion = await client.chat.completions.create({
    model: "grok-beta",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content ?? "";
}

async function callDeepSeek(prompt: string): Promise<string> {
  // DeepSeek uses OpenAI-compatible API
  const OpenAI = (await import("openai")).default;
  const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
  });
  const completion = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
  });
  return completion.choices[0]?.message?.content ?? "";
}

export async function processContent(
  provider: AIProvider,
  task: AITask,
  input: ProcessInput
): Promise<ProcessResult> {
  const prompt = buildPrompt(task, input);

  let output: string;
  switch (provider) {
    case "Claude":    output = await callClaude(prompt); break;
    case "GPT-4":     output = await callGPT4(prompt); break;
    case "Gemini":    output = await callGemini(prompt); break;
    case "Grok":      output = await callGrok(prompt); break;
    case "DeepSeek":  output = await callDeepSeek(prompt); break;
    default:          output = input.content;
  }

  const result: ProcessResult = {
    title: task === "rewrite" || task === "translate" ? input.title : input.title,
    content: ["rewrite", "translate"].includes(task) ? output : input.content,
    provider,
  };

  if (task === "summarize") result.summary = output;
  if (task === "categorize") result.category = output.trim();
  if (task === "generate_hashtags") {
    result.hashtags = output
      .split(/[,\n]/)
      .map((h) => h.trim())
      .filter((h) => h.startsWith("#"));
  }

  return result;
}
