import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const assetDir = "/home/ubuntu/reel-production-assets/REEL-0029";
const sourceDir = `${assetDir}/visual-src`;
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const sha256 = path =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

const frame = (scene, art) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
  <defs>
    <linearGradient id="sky${scene}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#1A1234"/>
      <stop offset=".48" stop-color="#3A1E4D"/>
      <stop offset="1" stop-color="#813844"/>
    </linearGradient>
    <radialGradient id="mist${scene}" cx="50%" cy="37%" r="67%">
      <stop stop-color="#FFE3A3" stop-opacity=".42"/>
      <stop offset="1" stop-color="#FFE3A3" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow${scene}" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="13" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="soft${scene}" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
  </defs>
  <rect width="720" height="1280" fill="url(#sky${scene})"/>
  <ellipse cx="360" cy="488" rx="370" ry="480" fill="url(#mist${scene})"/>
  <path d="M0 1090C138 1018 254 1123 366 1076C492 1024 596 1088 720 1012V1280H0Z" fill="#140D2A" fill-opacity=".66"/>
  ${art}
</svg>`;

const scenes = [
  `<g fill="none" stroke-linecap="round">
    <path d="M136 815C145 578 230 386 368 270C493 389 569 566 576 814" stroke="#D56C77" stroke-width="18" opacity=".62"/>
    <path d="M174 873C211 711 263 553 361 418C449 553 510 711 546 873" stroke="#F6C76E" stroke-width="13" filter="url(#glow01)"/>
    <circle cx="361" cy="418" r="62" fill="#FFE3A3" fill-opacity=".18" stroke="#FFE3A3" stroke-width="10"/>
    <circle cx="174" cy="873" r="25" fill="#F6C76E"/><circle cx="546" cy="873" r="25" fill="#F6C76E"/>
    <path d="M313 306L361 253L409 306" stroke="#90D7C4" stroke-width="11" stroke-dasharray="16 20"/>
  </g>`,
  `<g fill="none" stroke-linejoin="round">
    <path d="M120 733L226 521L328 610L420 389L550 588L610 488" stroke="#90D7C4" stroke-width="14" opacity=".82"/>
    <path d="M120 733L226 521L328 610" stroke="#F6C76E" stroke-width="20" filter="url(#glow02)"/>
    <path d="M420 389L550 588L610 488" stroke="#D56C77" stroke-width="20" stroke-dasharray="20 19"/>
    <circle cx="120" cy="733" r="24" fill="#F6C76E"/><circle cx="226" cy="521" r="24" fill="#F6C76E"/>
    <circle cx="328" cy="610" r="24" fill="#FFE3A3"/><circle cx="420" cy="389" r="24" fill="#90D7C4"/>
    <circle cx="550" cy="588" r="24" fill="#D56C77"/><circle cx="610" cy="488" r="24" fill="#D56C77"/>
    <path d="M92 928H628" stroke="#FFE3A3" stroke-opacity=".32" stroke-width="7"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M122 790C188 576 253 450 346 361" stroke="#90D7C4" stroke-width="12"/>
    <path d="M598 790C526 576 467 450 374 361" stroke="#90D7C4" stroke-width="12"/>
    <path d="M346 361C352 354 359 350 367 350C375 350 382 354 390 361" stroke="#F6C76E" stroke-width="16" stroke-dasharray="16 18" filter="url(#glow03)"/>
    <circle cx="346" cy="361" r="34" fill="#F6C76E"/><circle cx="390" cy="361" r="34" fill="#D56C77"/>
    <path d="M177 906C261 859 459 859 543 906" stroke="#D56C77" stroke-width="18"/>
    <path d="M243 981C306 946 414 946 477 981" stroke="#FFE3A3" stroke-width="10" opacity=".7"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M167 825C200 692 235 560 270 428" stroke="#D56C77" stroke-width="24" opacity=".35"/>
    <path d="M360 825V395" stroke="#F6C76E" stroke-width="24" filter="url(#glow04)"/>
    <path d="M553 825C520 692 485 560 450 428" stroke="#90D7C4" stroke-width="24" opacity=".35"/>
    <circle cx="270" cy="428" r="48" fill="#D56C77"/><circle cx="360" cy="395" r="57" fill="#F6C76E"/>
    <circle cx="450" cy="428" r="48" fill="#90D7C4"/>
    <path d="M167 895H553" stroke="#FFE3A3" stroke-width="9" stroke-dasharray="12 18" opacity=".72"/>
    <path d="M211 977H509" stroke="#90D7C4" stroke-width="8" opacity=".5"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M166 444C240 367 480 367 554 444" stroke="#FFE3A3" stroke-width="10" opacity=".62"/>
    <path d="M126 810C192 701 258 630 360 561C462 630 528 701 594 810" stroke="#90D7C4" stroke-width="16"/>
    <path d="M126 810C238 879 482 879 594 810" stroke="#D56C77" stroke-width="16"/>
    <circle cx="360" cy="561" r="68" fill="#F6C76E" fill-opacity=".24" stroke="#F6C76E" stroke-width="11" filter="url(#glow05)"/>
    <circle cx="126" cy="810" r="26" fill="#90D7C4"/><circle cx="594" cy="810" r="26" fill="#D56C77"/>
    <path d="M268 975C299 930 421 930 452 975" stroke="#FFE3A3" stroke-width="14" stroke-dasharray="10 17"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M101 848C181 758 246 711 322 678" stroke="#90D7C4" stroke-width="16"/>
    <path d="M619 848C539 758 474 711 398 678" stroke="#D56C77" stroke-width="16"/>
    <path d="M322 678C338 671 350 664 360 653C370 664 382 671 398 678" stroke="#F6C76E" stroke-width="14" stroke-dasharray="18 16"/>
    <circle cx="101" cy="848" r="25" fill="#90D7C4"/><circle cx="619" cy="848" r="25" fill="#D56C77"/>
    <circle cx="360" cy="653" r="48" fill="#FFE3A3" fill-opacity=".18" stroke="#FFE3A3" stroke-width="9"/>
    <path d="M173 981C260 932 460 932 547 981" stroke="#F6C76E" stroke-width="15" filter="url(#glow06)"/>
    <circle cx="229" cy="529" r="9" fill="#FFE3A3"/><circle cx="488" cy="487" r="9" fill="#FFE3A3"/>
    <circle cx="328" cy="412" r="7" fill="#90D7C4"/><circle cx="419" cy="574" r="7" fill="#D56C77"/>
  </g>`,
];

const output = scenes.map((art, offset) => {
  const scene = String(offset + 1).padStart(2, "0");
  const svg = `${sourceDir}/r0029_information_gap_scene_${scene}.svg`;
  const png = `${outputDir}/r0029-information-gap-${scene}.png`;
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
  `${assetDir}/REEL-0029_VISUAL_PROVENANCE.json`,
  JSON.stringify(
    {
      reelId: "0029",
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
  )
);
