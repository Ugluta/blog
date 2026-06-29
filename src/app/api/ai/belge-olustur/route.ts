import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateDocument } from '@/lib/ai';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });

  const body = await req.json();
  const { prompt, template } = body;

  if (!prompt) return NextResponse.json({ error: 'Prompt zorunlu' }, { status: 400 });

  try {
    const content = await generateDocument(prompt, template);
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json({ error: 'AI belgesi üretilemedi: ' + String(error) }, { status: 500 });
  }
}
