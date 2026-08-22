import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const [assetDir, captionsPath, outputPath] = process.argv.slice(2);
if (!assetDir || !captionsPath || !outputPath) {
  throw new Error("Usage: node render-reel.mjs <assetDir> <captions.srt> <output.mp4>");
}

const voicePath = resolve(assetDir, "REEL-0002_voice_final.wav");
const imagePaths = [1, 2, 3, 4, 5, 6].map(number => resolve("/home/ubuntu/webdev-static-assets", `reel0002_scene0${number}.png`));
for (const requiredPath of [voicePath, captionsPath, ...imagePaths]) {
  if (!existsSync(requiredPath)) throw new Error(`Missing render input: ${requiredPath}`);
}

const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", voicePath], { encoding: "utf8" });
if (probe.status !== 0) throw new Error(probe.stderr || "Could not determine narration duration.");
const duration = Number.parseFloat(probe.stdout.trim());
if (!Number.isFinite(duration) || duration < 1) throw new Error("Narration duration is invalid.");
const sceneDuration = (duration / imagePaths.length).toFixed(3);
const frameCount = Math.ceil((duration / imagePaths.length) * 30);

const imageArgs = imagePaths.flatMap(imagePath => ["-loop", "1", "-t", sceneDuration, "-i", imagePath]);
const filterParts = imagePaths.map((_, index) => `[${index}:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,zoompan=z='min(zoom+0.00045,1.055)':d=${frameCount}:s=720x1280:fps=30,setsar=1[v${index}]`);
filterParts.push(`${imagePaths.map((_, index) => `[v${index}]`).join("")}concat=n=${imagePaths.length}:v=1:a=0[base]`);
const subtitlePath = resolve(captionsPath).replaceAll("\\", "\\\\").replaceAll(":", "\\:").replaceAll("'", "\\'");
const subtitleFilter = `subtitles='${subtitlePath}':force_style='FontName=Noto Sans Devanagari,FontSize=38,PrimaryColour=&H00FFFFFF,OutlineColour=&H80000000,BorderStyle=1,Outline=2,Shadow=0,Alignment=2,MarginV=84'`;

const args = [
  "-y", ...imageArgs, "-i", voicePath,
  "-filter_complex", filterParts.join(";"),
  "-map", "[base]", "-map", `${imagePaths.length}:a:0`,
  "-vf", subtitleFilter,
  "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", outputPath,
];
const render = spawnSync("ffmpeg", args, { encoding: "utf8", maxBuffer: 1024 * 1024 * 4 });
if (render.status !== 0) throw new Error(render.stderr || "FFmpeg render failed.");
console.log(JSON.stringify({ outputPath, narrationSeconds: duration, sceneSeconds: Number(sceneDuration), frameCount }, null, 2));
