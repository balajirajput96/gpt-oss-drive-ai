import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const assetDir = "/home/ubuntu/reel-production-assets/REEL-0027";
const sourceDir = `${assetDir}/visual-src`;
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const wrap = (art, scene) =>
  `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280"><defs><linearGradient id="b${scene}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#172843"/><stop offset="1" stop-color="#325B58"/></linearGradient></defs><rect width="720" height="1280" fill="url(#b${scene})"/><rect x="34" y="34" width="652" height="1212" rx="44" fill="none" stroke="#F6E7CB" stroke-opacity=".3" stroke-width="3"/>${art}</svg>`;
const scenes = [
  `<circle cx="230" cy="670" r="44" fill="#F5C46B"/><circle cx="360" cy="590" r="72" fill="#88D5CA"/><path d="M110 830C245 600 430 950 610 420" fill="none" stroke="#F6E7CB" stroke-width="16" stroke-linecap="round"/>`,
  `<rect x="180" y="470" width="360" height="260" rx="36" fill="#1F3B59" stroke="#88D5CA" stroke-width="12"/><path d="M255 790V950M465 790V950" stroke="#F6E7CB" stroke-width="18"/><rect x="275" y="555" width="170" height="40" rx="20" fill="#F5C46B"/>`,
  `<path d="M120 780H380C500 780 500 470 600 470" fill="none" stroke="#88D5CA" stroke-width="18" stroke-linecap="round"/><circle cx="180" cy="780" r="36" fill="#F5C46B"/><circle cx="600" cy="470" r="36" fill="#E48779"/>`,
  `<circle cx="360" cy="625" r="225" fill="none" stroke="#F6E7CB" stroke-opacity=".35" stroke-width="10" stroke-dasharray="18 24"/><path d="M190 625H530" stroke="#88D5CA" stroke-width="24" stroke-linecap="round"/><circle cx="360" cy="625" r="56" fill="#F5C46B"/>`,
  `<path d="M130 900C210 460 300 900 380 520C470 250 530 750 610 410" fill="none" stroke="#88D5CA" stroke-width="16"/><circle cx="210" cy="700" r="34" fill="#F5C46B"/><circle cx="530" cy="550" r="34" fill="#E48779"/>`,
  `<path d="M150 835C260 520 410 520 570 835" fill="none" stroke="#F6E7CB" stroke-width="16"/><path d="M230 740A150 150 0 1 1 490 740" fill="none" stroke="#88D5CA" stroke-width="24"/><circle cx="360" cy="740" r="42" fill="#F5C46B"/>`,
];
const outputs = scenes.map((art, index) => {
  const scene = String(index + 1).padStart(2, "0");
  const svg = `${sourceDir}/reel0027_scene${scene}.svg`;
  const png = `${outputDir}/reel0027_scene${scene}.png`;
  writeFileSync(svg, wrap(art, scene));
  const result = spawnSync("ffmpeg", ["-y", "-i", svg, "-frames:v", "1", png]);
  if (result.status !== 0) throw new Error(`Scene ${scene} failed`);
  return { scene, svg, png };
});
writeFileSync(
  `${assetDir}/REEL-0027_VISUAL_PROVENANCE.json`,
  JSON.stringify(
    {
      reelId: "0027",
      visualRoute: "original_deterministic_svg_motion_graphics",
      imageGenerationUsed: false,
      quotaOrAccessControlBypass: false,
      reusedLegacyAsset: false,
      embeddedText: false,
      realPersonDepicted: false,
      scenes: outputs,
    },
    null,
    2
  )
);
