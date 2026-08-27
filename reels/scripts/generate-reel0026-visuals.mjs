import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const assetDir = "/home/ubuntu/reel-production-assets/REEL-0026";
const sourceDir = `${assetDir}/visual-src`;
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const wrap = (art, scene) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
<defs><linearGradient id="bg${scene}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111B35"/><stop offset="1" stop-color="#4A2843"/></linearGradient><linearGradient id="glow${scene}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#80D8CF"/><stop offset="1" stop-color="#F2BC67"/></linearGradient></defs>
<rect width="720" height="1280" fill="url(#bg${scene})"/><rect x="34" y="34" width="652" height="1212" rx="44" fill="none" stroke="#F5E5C9" stroke-opacity=".30" stroke-width="3"/><g>${art}</g>
</svg>`;

const scenes = [
  `<circle cx="360" cy="585" r="147" fill="#17254A" stroke="#80D8CF" stroke-width="13"/><circle cx="360" cy="585" r="50" fill="#F2BC67"/><path d="M98 585H220M500 585H622M360 260V425M360 745V922" stroke="#F5E5C9" stroke-width="15" stroke-linecap="round"/><path d="M98 585C178 430 248 390 360 390C472 390 542 430 622 585" fill="none" stroke="#DF7771" stroke-width="14" stroke-linecap="round"/><circle cx="98" cy="585" r="22" fill="#80D8CF"/><circle cx="622" cy="585" r="22" fill="#DF7771"/>`,
  `<rect x="120" y="380" width="480" height="430" rx="42" fill="#17254A" stroke="#80D8CF" stroke-width="11"/><circle cx="230" cy="550" r="50" fill="#F2BC67"/><circle cx="360" cy="550" r="50" fill="#80D8CF"/><circle cx="490" cy="550" r="50" fill="#DF7771"/><path d="M230 630V720M360 630V720M490 630V720" stroke="#F5E5C9" stroke-width="12" stroke-linecap="round"/><path d="M168 884C244 830 476 830 552 884" fill="none" stroke="url(#glow02)" stroke-width="16" stroke-linecap="round"/>`,
  `<path d="M115 640C175 442 296 397 360 525C424 397 545 442 605 640" fill="none" stroke="#80D8CF" stroke-width="13"/><path d="M154 760H566" stroke="#F5E5C9" stroke-opacity=".65" stroke-width="12" stroke-linecap="round" stroke-dasharray="18 20"/><circle cx="250" cy="640" r="90" fill="#17254A" stroke="#F2BC67" stroke-width="11"/><path d="M430 560C500 620 500 720 430 780" fill="none" stroke="#DF7771" stroke-width="18" stroke-linecap="round"/><path d="M400 670H550" stroke="#DF7771" stroke-width="10" stroke-linecap="round"/><circle cx="360" cy="440" r="25" fill="#F5E5C9"/>`,
  `<circle cx="360" cy="590" r="75" fill="#F2BC67"/><path d="M360 515C260 362 150 415 155 550C160 695 274 755 360 665C446 755 560 695 565 550C570 415 460 362 360 515Z" fill="none" stroke="#80D8CF" stroke-width="13"/><path d="M360 665C360 820 238 890 128 838M360 665C360 820 482 890 592 838" fill="none" stroke="#DF7771" stroke-width="14" stroke-linecap="round"/><circle cx="128" cy="838" r="18" fill="#DF7771"/><circle cx="592" cy="838" r="18" fill="#80D8CF"/>`,
  `<circle cx="360" cy="610" r="260" fill="none" stroke="#F5E5C9" stroke-opacity=".20" stroke-width="6" stroke-dasharray="14 25"/><path d="M156 800C188 470 532 470 564 800" fill="#17254A" fill-opacity=".68" stroke="#80D8CF" stroke-width="13"/><rect x="294" y="548" width="132" height="132" rx="26" fill="#F2BC67"/><path d="M240 910C320 836 400 836 480 910" fill="none" stroke="#DF7771" stroke-width="18" stroke-linecap="round"/><circle cx="360" cy="614" r="26" fill="#17254A"/>`,
  `<path d="M95 775C160 520 280 478 360 610C440 478 560 520 625 775" fill="none" stroke="url(#glow06)" stroke-width="16" stroke-linecap="round"/><circle cx="242" cy="610" r="92" fill="#17254A" stroke="#80D8CF" stroke-width="11"/><circle cx="478" cy="610" r="92" fill="#17254A" stroke="#F2BC67" stroke-width="11"/><path d="M300 916C340 874 380 874 420 916" fill="none" stroke="#F5E5C9" stroke-width="14" stroke-linecap="round"/><circle cx="360" cy="610" r="21" fill="#DF7771"/>`,
];

const provenanceScenes = scenes.map((artwork, index) => {
  const scene = String(index + 1).padStart(2, "0");
  const sourcePath = `${sourceDir}/reel0026_scene${scene}.svg`;
  const outputPath = `${outputDir}/reel0026_scene${scene}.png`;
  writeFileSync(sourcePath, wrap(artwork, scene));
  const render = spawnSync(
    "ffmpeg",
    ["-y", "-i", sourcePath, "-frames:v", "1", outputPath],
    { encoding: "utf8" }
  );
  if (render.status !== 0)
    throw new Error(render.stderr || `Scene ${scene} render failed.`);
  return {
    scene,
    sourcePath,
    outputPath,
    source: "original_deterministic_svg",
    containsText: false,
  };
});

writeFileSync(
  `${assetDir}/REEL-0026_VISUAL_PROVENANCE.json`,
  JSON.stringify(
    {
      reelId: "0026",
      canonicalFolderId: "1qfmgQ_BKUroAEe8R6iNE9ZDE3YGqZVcZ",
      visualRoute: "original_deterministic_svg_motion_graphics",
      imageGenerationUsed: false,
      quotaOrAccessControlBypass: false,
      reusedLegacyAsset: false,
      embeddedText: false,
      realPersonDepicted: false,
      sceneCount: 6,
      scenes: provenanceScenes,
    },
    null,
    2
  )
);
