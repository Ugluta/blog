import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateDocument(prompt: string, template?: string): Promise<string> {
  const systemPrompt = template
    ? `Sen bir eğitim içerikleri uzmanısın. ${template} şablonuna göre Türkçe, profesyonel eğitim belgesi oluştur.`
    : 'Sen bir eğitim içerikleri uzmanısın. Türk milli eğitim sistemine uygun, profesyonel Türkçe belgeler oluşturuyorsun.';

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export async function generateQuestions(params: {
  subject: string;
  grade: string;
  topic: string;
  count: number;
  type: string;
  difficulty: string;
}): Promise<Array<{ content: string; options?: string[]; answer: string; explanation: string }>> {
  const prompt = `
    ${params.subject} dersi, ${params.grade} seviyesi için "${params.topic}" konusunda
    ${params.count} adet ${params.type} tipi, ${params.difficulty} zorluk seviyesinde soru oluştur.
    
    JSON formatında dön: [{"content": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A", "explanation": "..."}]
    Sadece JSON dön, başka açıklama ekleme.
  `;

  const message = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]';
  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export async function summarizeContent(content: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `şu içeriği Türkçe olarak 2-3 cümleyle özetle: ${content.substring(0, 2000)}`,
    }],
  });

  return message.content[0].type === 'text' ? message.content[0].text : '';
}

export async function processScrapedContent(rawContent: string, sourceUrl: string): Promise<{
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
}> {
  const prompt = `
    Aşağıdaki içeriği eğitim platformu için düzenle. Kaynak: ${sourceUrl}
    
    Ham içerik:
    ${rawContent.substring(0, 3000)}
    
    JSON formatında dön: {
      "title": "temiz başlık",
      "excerpt": "kısa özet (max 200 karakter)",
      "content": "düzenlenmiş, tam içerik (HTML)",
      "tags": ["etiket1", "etiket2"]
    }
    Sadece JSON dön.
  `;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '{}';
  try {
    return JSON.parse(text);
  } catch {
    return { title: 'Başlıksız', excerpt: '', content: rawContent, tags: [] };
  }
}
