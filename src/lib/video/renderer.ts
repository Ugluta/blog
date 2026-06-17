import path from "path";
import fs from "fs/promises";
import { createWriteStream, existsSync } from "fs";
import https from "https";
import http from "http";

export interface RenderScene {
  imageUrl: string;
  text?: string;
  duration: number; // seconds
}

export interface RenderJob {
  projectId: string;
  scenes: RenderScene[];
  musicUrl?: string;
  aspectRatio: "9:16" | "1:1" | "16:9" | "4:5";
  outputDir: string;
}

export interface RenderResult {
  outputPath: string;
  outputUrl: string;
  durationSeconds: number;
}

const DIMENSIONS: Record<string, { w: number; h: number }> = {
  "9:16":  { w: 1080, h: 1920 },
  "1:1":   { w: 1080, h: 1080 },
  "16:9":  { w: 1920, h: 1080 },
  "4:5":   { w: 1080, h: 1350 },
};

async function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

async function getFfmpeg() {
  const ffmpeg = (await import("fluent-ffmpeg")).default;
  try {
    // ffmpeg-static provides a pre-built binary
    const ffmpegStatic = (await import("ffmpeg-static")).default;
    if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);
  } catch {
    // Fall back to system ffmpeg in PATH
  }
  return ffmpeg;
}

function wrapText(text: string, maxLen = 40): string {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxLen) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur.trim());
  // Escape special chars for FFmpeg drawtext
  return lines.join("\n").replace(/:/g, "\\:").replace(/'/g, "\\'").replace(/,/g, "\\,");
}

export async function renderVideo(job: RenderJob): Promise<RenderResult> {
  const ffmpeg = await getFfmpeg();
  const { w, h } = DIMENSIONS[job.aspectRatio] ?? DIMENSIONS["9:16"];
  const tmpDir = path.join(job.outputDir, `tmp_${job.projectId}`);
  await fs.mkdir(tmpDir, { recursive: true });
  await fs.mkdir(job.outputDir, { recursive: true });

  const clipPaths: string[] = [];
  const totalDuration = job.scenes.reduce((s, sc) => s + sc.duration, 0);

  // 1. Create one clip per scene
  for (let i = 0; i < job.scenes.length; i++) {
    const scene = job.scenes[i];
    const imgPath = path.join(tmpDir, `img_${i}.jpg`);
    const clipPath = path.join(tmpDir, `clip_${i}.mp4`);

    // Download image
    if (scene.imageUrl.startsWith("http")) {
      await downloadFile(scene.imageUrl, imgPath);
    } else if (existsSync(scene.imageUrl)) {
      await fs.copyFile(scene.imageUrl, imgPath);
    } else {
      // Fallback: create a solid color frame
      await new Promise<void>((res, rej) => {
        ffmpeg()
          .input(`color=c=0x1E293B:size=${w}x${h}:rate=25:duration=${scene.duration}`)
          .inputFormat("lavfi")
          .outputOptions(["-c:v", "libx264", "-pix_fmt", "yuv420p"])
          .output(clipPath)
          .on("end", () => res())
          .on("error", rej)
          .run();
      });
      clipPaths.push(clipPath);
      continue;
    }

    // Build drawtext filter for scene text overlay
    const textFilter = scene.text?.trim()
      ? `,drawtext=fontsize=${Math.round(w * 0.045)}:fontcolor=white:text='${wrapText(scene.text)}':x=(w-text_w)/2:y=h*0.82:box=1:boxcolor=black@0.5:boxborderw=12:line_spacing=8`
      : "";

    // Image → video clip with zoom-pan (Ken Burns)
    const vf = [
      `scale=${w * 2}:${h * 2}`,
      `crop=${w}:${h}:'(iw-${w})/2+((iw-${w})/2)*sin(2*PI*t/${scene.duration})':'(ih-${h})/2'`,
      `fade=in:0:15`,
      `fade=out:st=${scene.duration - 0.6}:d=0.6`,
    ].join(",") + textFilter;

    await new Promise<void>((res, rej) => {
      ffmpeg()
        .input(imgPath)
        .inputOptions(["-loop", "1"])
        .outputOptions([
          "-vf", vf,
          "-c:v", "libx264",
          "-t", String(scene.duration),
          "-r", "25",
          "-pix_fmt", "yuv420p",
          "-preset", "fast",
        ])
        .output(clipPath)
        .on("end", () => res())
        .on("error", rej)
        .run();
    });

    clipPaths.push(clipPath);
  }

  // 2. Write concat list
  const concatFile = path.join(tmpDir, "concat.txt");
  await fs.writeFile(concatFile, clipPaths.map((p) => `file '${p}'`).join("\n"));

  const concatPath = path.join(tmpDir, "concat.mp4");

  // 3. Concatenate clips
  await new Promise<void>((res, rej) => {
    ffmpeg()
      .input(concatFile)
      .inputOptions(["-f", "concat", "-safe", "0"])
      .outputOptions(["-c", "copy"])
      .output(concatPath)
      .on("end", () => res())
      .on("error", rej)
      .run();
  });

  const outputFilename = `${job.projectId}.mp4`;
  const outputPath = path.join(job.outputDir, outputFilename);

  // 4. Mix in audio if provided
  if (job.musicUrl) {
    const audioPath = path.join(tmpDir, "music.mp3");
    await downloadFile(job.musicUrl, audioPath);

    await new Promise<void>((res, rej) => {
      ffmpeg()
        .input(concatPath)
        .input(audioPath)
        .outputOptions([
          "-c:v", "copy",
          "-c:a", "aac",
          "-b:a", "128k",
          "-shortest",
          "-af", `afade=t=out:st=${totalDuration - 1}:d=1`,
          "-map", "0:v:0",
          "-map", "1:a:0",
        ])
        .output(outputPath)
        .on("end", () => res())
        .on("error", rej)
        .run();
    });
  } else {
    await fs.rename(concatPath, outputPath);
  }

  // 5. Cleanup temp dir
  await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => null);

  const outputUrl = `/renders/${outputFilename}`;
  return { outputPath, outputUrl, durationSeconds: totalDuration };
}
