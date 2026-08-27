import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const assetDir = "/home/ubuntu/reel-production-assets/REEL-0030";
const sourceDir = `${assetDir}/visual-src`;
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const sha256 = path =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

const frame = (scene, art) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
  <defs>
    <linearGradient id="ground${scene}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#09172F"/>
      <stop offset=".47" stop-color="#243F80"/>
      <stop offset="1" stop-color="#754F9E"/>
    </linearGradient>
    <radialGradient id="halo${scene}" cx="50%" cy="38%" r="64%">
      <stop stop-color="#E3E2FF" stop-opacity=".48"/>
      <stop offset="1" stop-color="#E3E2FF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass${scene}" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#D8D7FF" stop-opacity=".56"/>
      <stop offset="1" stop-color="#A6B7FF" stop-opacity=".09"/>
    </linearGradient>
    <filter id="glow${scene}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="14" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="720" height="1280" fill="url(#ground${scene})"/>
  <ellipse cx="360" cy="470" rx="385" ry="495" fill="url(#halo${scene})"/>
  <path d="M0 1094C128 1048 250 1119 376 1069C491 1023 607 1086 720 1037V1280H0Z" fill="#061126" fill-opacity=".68"/>
  ${art}
</svg>`;

const scenes = [
  `<g fill="none" stroke-linejoin="round">
    <path d="M156 845L184 497L359 303L536 497L564 845Z" fill="url(#glass01)" stroke="#C9CBFF" stroke-width="12"/>
    <path d="M235 757L255 548L360 433L465 548L485 757Z" stroke="#F5C86A" stroke-width="17" filter="url(#glow01)"/>
    <path d="M312 357L360 302L408 357" stroke="#94E2D1" stroke-width="12" stroke-dasharray="13 17"/>
    <circle cx="360" cy="433" r="34" fill="#F5C86A"/>
    <path d="M117 914H603" stroke="#C9CBFF" stroke-width="7" stroke-opacity=".38"/>
  </g>`,
  `<g transform="rotate(-7 360 632)">
    <rect x="141" y="368" width="184" height="242" rx="27" fill="#B9C4FF" fill-opacity=".2" stroke="#B9C4FF" stroke-width="10"/>
    <rect x="395" y="438" width="184" height="242" rx="27" fill="#F5C86A" fill-opacity=".2" stroke="#F5C86A" stroke-width="12" filter="url(#glow02)"/>
    <rect x="237" y="750" width="245" height="180" rx="27" fill="#94E2D1" fill-opacity=".18" stroke="#94E2D1" stroke-width="10"/>
    <circle cx="233" cy="489" r="20" fill="#C9CBFF"/><circle cx="487" cy="559" r="20" fill="#F5C86A"/><circle cx="359" cy="840" r="20" fill="#94E2D1"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M107 813C210 682 262 578 356 396" stroke="#A8B7FF" stroke-width="12" stroke-dasharray="18 19" opacity=".7"/>
    <path d="M613 813C510 682 458 578 364 396" stroke="#A8B7FF" stroke-width="12" stroke-dasharray="18 19" opacity=".7"/>
    <circle cx="360" cy="389" r="76" fill="#F5C86A" fill-opacity=".18" stroke="#F5C86A" stroke-width="14" filter="url(#glow03)"/>
    <circle cx="168" cy="758" r="44" fill="#C9CBFF" fill-opacity=".26" stroke="#C9CBFF" stroke-width="10"/>
    <circle cx="552" cy="758" r="44" fill="#94E2D1" fill-opacity=".26" stroke="#94E2D1" stroke-width="10"/>
    <circle cx="286" cy="672" r="22" fill="#C9CBFF"/><circle cx="434" cy="672" r="22" fill="#94E2D1"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M360 342C432 409 474 497 474 610C474 722 432 808 360 878C288 808 246 722 246 610C246 497 288 409 360 342Z" fill="url(#glass04)" stroke="#D7D8FF" stroke-width="12"/>
    <path d="M360 342V878M246 610H474" stroke="#A5B8FF" stroke-width="9" opacity=".75"/>
    <path d="M281 469C329 492 391 492 439 469" stroke="#F5C86A" stroke-width="16" filter="url(#glow04)"/>
    <path d="M281 751C329 728 391 728 439 751" stroke="#94E2D1" stroke-width="15"/>
    <circle cx="360" cy="610" r="42" fill="#F5C86A" fill-opacity=".22" stroke="#F5C86A" stroke-width="10"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <circle cx="360" cy="545" r="205" stroke="#B7C2FF" stroke-width="12" stroke-dasharray="21 19" opacity=".78"/>
    <circle cx="360" cy="545" r="138" stroke="#94E2D1" stroke-width="13" stroke-dasharray="12 20"/>
    <circle cx="360" cy="545" r="76" fill="#F5C86A" fill-opacity=".18" stroke="#F5C86A" stroke-width="14" filter="url(#glow05)"/>
    <path d="M121 860C218 823 502 823 599 860" stroke="#D7D8FF" stroke-width="12" opacity=".56"/>
    <path d="M196 943C273 916 447 916 524 943" stroke="#94E2D1" stroke-width="11" opacity=".72"/>
  </g>`,
  `<g fill="none" stroke-linejoin="round">
    <path d="M151 859L244 753L333 807L420 632L566 744" stroke="#B8C4FF" stroke-width="17" opacity=".7"/>
    <path d="M151 859L244 753L333 807" stroke="#94E2D1" stroke-width="20" filter="url(#glow06)"/>
    <path d="M333 807L420 632L566 744" stroke="#F5C86A" stroke-width="19"/>
    <circle cx="151" cy="859" r="28" fill="#94E2D1"/><circle cx="244" cy="753" r="28" fill="#94E2D1"/>
    <circle cx="333" cy="807" r="28" fill="#C9CBFF"/><circle cx="420" cy="632" r="28" fill="#F5C86A"/><circle cx="566" cy="744" r="28" fill="#F5C86A"/>
    <path d="M121 979H599" stroke="#D7D8FF" stroke-width="8" stroke-opacity=".35"/>
  </g>`,
];

const output = scenes.map((art, offset) => {
  const scene = String(offset + 1).padStart(2, "0");
  const svg = `${sourceDir}/r0030_curiosity_learning_scene_${scene}.svg`;
  const png = `${outputDir}/r0030-curiosity-learning-${scene}.png`;
  writeFileSync(svg, frame(scene, art));
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loglevel",
      "error",
      "-i",
      svg,
      "-frames:v",
      "1",
      "-pix_fmt",
      "yuv420p",
      png,
    ],
    { stdio: "pipe" }
  );
  if (result.status !== 0) {
    throw new Error(`Scene ${scene} failed: ${result.stderr.toString()}`);
  }
  return { scene, svg, png, svgSha256: sha256(svg), pngSha256: sha256(png) };
});

writeFileSync(
  `${assetDir}/REEL-0030_VISUAL_PROVENANCE.json`,
  `${JSON.stringify(
    {
      reelId: "0030",
      visualRoute: "original_deterministic_svg_motion_graphics",
      imageGenerationUsed: false,
      quotaOrAccessControlBypass: false,
      reusedLegacyAsset: false,
      embeddedText: false,
      realPersonDepicted: false,
      format: "720x1280 PNG",
      scenes: output,
    },
    null,
    2
  )}\n`
);
