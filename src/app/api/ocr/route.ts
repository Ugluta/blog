import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const PROMPTS = {
  extract: 'Bu görseldeki tüm metni olduğu gibi çıkar. Orijinal satır düzenini koru. Sadece metni döndür, açıklama ekleme.',
  clean:   'Bu görseldeki metni çıkar, ardından Türkçe imla kurallarına göre düzenle ve paragrafları düzgün biçimlendir. Sadece düzenlemiş metni döndür.',
  summary: 'Bu görseldeki belgenin içeriğini 3-5 cümleyle Türkçe olarak özetle. Belgenin türünü, konusunu ve önemli bilgileri belirt.',
}

type ImageMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

export async function POST(req: NextRequest) {
  try {
    const { imageData, mode = 'extract' } = await req.json()

    if (!imageData) {
      return NextResponse.json({ error: 'Görüntü verisi eksik' }, { status: 400 })
    }

    const prompt = PROMPTS[mode as keyof typeof PROMPTS] ?? PROMPTS.extract

    // Extract base64 and media type from data URL
    const matches = imageData.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: 'Geçersiz görüntü formatı' }, { status: 400 })
    }

    const rawMediaType: string = matches[1]
    const base64Data = matches[2]

    const isPdf = rawMediaType === 'application/pdf'
    const mediaType = rawMediaType as ImageMediaType

    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: isPdf
            ? [{ type: 'text', text: `${prompt}\n\n(PDF dosyası yüklendi - metin içeriğini analiz et)` }]
            : [
                {
                  type: 'image',
                  source: { type: 'base64', media_type: mediaType, data: base64Data },
                },
                { type: 'text', text: prompt },
              ],
        },
      ],
    })

    const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
    return NextResponse.json({ text })
  } catch (e: unknown) {
    console.error('OCR error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'OCR işlemi başarısız' },
      { status: 500 }
    )
  }
}
