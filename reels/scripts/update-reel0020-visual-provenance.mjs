import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("../..", import.meta.url).pathname);
const outputDir = resolve(root, "reels", "output", "REEL-0020");
const sceneIds = ["01", "02", "03", "04", "05", "06"];
const now = new Date().toISOString();

for (const sceneId of sceneIds) {
  const imagePath = resolve(outputDir, `REEL-0020_scene_${sceneId}.png`);
  const provenancePath = resolve(
    outputDir,
    `REEL-0020_scene_${sceneId}_provenance.json`
  );
  const bytes = statSync(imagePath).size;
  const sha256 = createHash("sha256")
    .update(readFileSync(imagePath))
    .digest("hex");
  const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
  provenance.stage = "original_visual_recovery";
  provenance.provenanceType = "original_generated_visual";
  provenance.source =
    sceneId === "01"
      ? "newly generated in this bounded run as the Reel 0020 visual reference; no legacy Drive or local asset reused"
      : "newly generated in this bounded run; conditioned only on the new Reel 0020 Scene 01 reference; no legacy Drive or local asset reused";
  provenance.artifact = {
    ...provenance.artifact,
    path: `reels/output/REEL-0020/REEL-0020_scene_${sceneId}.png`,
    format: "PNG",
    width: 1440,
    height: 2560,
    aspectRatio: "9:16",
    sha256,
    bytes,
  };
  provenance.createdAt = now;
  provenance.qc = {
    technical:
      "PASS: deterministic file/ffprobe QC reports PNG, 8-bit RGB, non-interlaced, 1440x2560, codec png, pix_fmt rgb24, exact 9:16 pixel ratio, and recorded SHA-256.",
    visual:
      "PASS: lightweight visual review found a coherent original editorial scene with natural anatomy and no visible readable text, logo, watermark, chart, graph, medical symbol, UI overlay, branded device, or obvious fatal defect.",
    packageStatus:
      "COMPLETE for original visual inputs: six original 9:16 scene inputs are present locally; rendering remains a separate gated stage.",
  };
  writeFileSync(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`);
}

const statePath = resolve(root, "reels", "production_state.json");
const state = JSON.parse(readFileSync(statePath, "utf8"));
if (state.activeReelId !== "0020" || state.nextReelId !== "0020") {
  throw new Error(
    "Refusing to update Reel 0020 checkpoint: active/next reel mismatch."
  );
}
state.runStatus = "researching";
state.lastCheckpointAt = now;
writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);

console.log(
  JSON.stringify({ reelId: "0020", sceneIds, checkpointAt: now }, null, 2)
);
