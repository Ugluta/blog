// TTS Provider — ElevenLabs (primary) with AWS Polly fallback
// Returns a Buffer of MP3 audio for the given text

export type TTSProvider = "elevenlabs" | "polly";

export interface TTSOptions {
  text: string;
  provider?: TTSProvider;
  voice?: string;
  language?: string;
}

export interface TTSResult {
  audioBuffer: Buffer;
  provider: TTSProvider;
  durationEstimateSeconds: number;
}

// ElevenLabs voices (Turkish friendly)
const ELEVENLABS_VOICES = {
  tr_male: "pNInz6obpgDQGcFmaJgB",    // Adam
  tr_female: "EXAVITQu4vr4xnSDxMaL",  // Bella
  en_male: "TxGEqnHWrfWFTfGW9XjX",    // Josh
  en_female: "21m00Tcm4TlvDq8ikWAM",  // Rachel
} as const;

async function synthesizeElevenLabs(options: TTSOptions): Promise<Buffer> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY not set");

  const voiceId = options.voice ?? ELEVENLABS_VOICES.tr_male;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: options.text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs error: ${res.status} ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function synthesizePolly(options: TTSOptions): Promise<Buffer> {
  const { PollyClient, SynthesizeSpeechCommand, OutputFormat } = await import("@aws-sdk/client-polly");
  type VoiceId = import("@aws-sdk/client-polly").VoiceId;
  type LanguageCode = import("@aws-sdk/client-polly").LanguageCode;

  const client = new PollyClient({
    region: process.env.AWS_REGION ?? "eu-west-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const voiceMap: Record<string, string> = {
    "tr-TR": "Filiz",
    "tr": "Filiz",
    "en-US": "Joanna",
    "en": "Joanna",
    "de-DE": "Marlene",
    "fr-FR": "Celine",
    "es-ES": "Lucia",
  };

  const voiceId = (options.voice ?? voiceMap[options.language ?? "tr"] ?? "Filiz") as VoiceId;

  const command = new SynthesizeSpeechCommand({
    Text: options.text,
    OutputFormat: OutputFormat.MP3,
    VoiceId: voiceId,
    Engine: "neural",
    LanguageCode: (options.language ?? "tr-TR") as LanguageCode,
  });

  const response = await client.send(command);
  if (!response.AudioStream) throw new Error("Polly: no audio stream returned");

  const chunks: Buffer[] = [];
  for await (const chunk of response.AudioStream as AsyncIterable<Uint8Array>) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// ~150 words per minute average speaking rate
function estimateDuration(text: string): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil((wordCount / 150) * 60));
}

export async function synthesizeSpeech(options: TTSOptions): Promise<TTSResult> {
  const provider = options.provider ?? (process.env.ELEVENLABS_API_KEY ? "elevenlabs" : "polly");

  let audioBuffer: Buffer;
  let usedProvider: TTSProvider = provider;

  try {
    if (provider === "elevenlabs") {
      audioBuffer = await synthesizeElevenLabs(options);
    } else {
      audioBuffer = await synthesizePolly(options);
    }
  } catch (primaryErr) {
    // Fallback to the other provider
    const fallback: TTSProvider = provider === "elevenlabs" ? "polly" : "elevenlabs";
    console.warn(`[TTS] ${provider} failed, falling back to ${fallback}:`, primaryErr);
    if (fallback === "polly") {
      audioBuffer = await synthesizePolly(options);
    } else {
      audioBuffer = await synthesizeElevenLabs(options);
    }
    usedProvider = fallback;
  }

  return {
    audioBuffer,
    provider: usedProvider,
    durationEstimateSeconds: estimateDuration(options.text),
  };
}

export { ELEVENLABS_VOICES };
