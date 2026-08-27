import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const assetDir = "/home/ubuntu/reel-production-assets/REEL-0028";
const sourceDir = `${assetDir}/visual-src`;
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const sha256 = path =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const frame = (scene, art) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
  <defs>
    <linearGradient id="bg${scene}" x1="0" y1="0" x2="0.92" y2="1">
      <stop stop-color="#071126"/>
      <stop offset="0.52" stop-color="#161B4A"/>
      <stop offset="1" stop-color="#342263"/>
    </linearGradient>
    <radialGradient id="halo${scene}" cx="50%" cy="42%" r="62%">
      <stop stop-color="#A3F7EC" stop-opacity=".36"/>
      <stop offset="1" stop-color="#A3F7EC" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow${scene}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="720" height="1280" fill="url(#bg${scene})"/>
  <ellipse cx="360" cy="550" rx="355" ry="450" fill="url(#halo${scene})"/>
  <path d="M0 1020C145 950 256 1120 392 1055C512 998 594 1037 720 954V1280H0Z" fill="#070B1D" fill-opacity=".56"/>
  ${art}
</svg>`;

const scenes = [
  `<g fill="none" stroke-linecap="round">
    <path d="M118 846C180 628 250 445 359 324" stroke="#56D6FF" stroke-width="15" opacity=".88"/>
    <path d="M360 324C456 456 520 620 590 857" stroke="#FFB6E8" stroke-width="15" opacity=".88"/>
    <path d="M118 846C255 892 460 892 590 857" stroke="#B5FFA7" stroke-width="15" opacity=".88"/>
    <circle cx="360" cy="324" r="74" stroke="#F7F0A5" stroke-width="10" filter="url(#glow01)"/>
    <circle cx="118" cy="846" r="28" fill="#56D6FF"/><circle cx="590" cy="857" r="28" fill="#FFB6E8"/>
    <circle cx="358" cy="890" r="28" fill="#B5FFA7"/>
  </g>`,
  `<g fill="none">
    <path d="M360 259C506 354 562 536 503 694C451 832 360 942 360 1010C360 942 269 832 217 694C158 536 214 354 360 259Z" fill="#FFCB83" fill-opacity=".13" stroke="#FFCB83" stroke-width="10"/>
    <path d="M360 324C461 391 489 517 452 625C421 717 360 786 360 846C360 786 299 717 268 625C231 517 259 391 360 324Z" fill="#A3F7EC" fill-opacity=".32" stroke="#A3F7EC" stroke-width="8" filter="url(#glow02)"/>
    <path d="M193 460C124 552 149 747 230 837M527 460C596 552 571 747 490 837" stroke="#7F8DFF" stroke-width="8" stroke-dasharray="10 20" opacity=".7"/>
  </g>`,
  `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M125 926L125 610L270 470L448 470L595 610L595 926Z" fill="#111B46" fill-opacity=".75" stroke="#A3F7EC" stroke-width="10"/>
    <path d="M125 610L360 738L595 610M360 738V982M270 470L360 738L448 470" stroke="#A3F7EC" stroke-width="8" opacity=".8"/>
    <circle cx="270" cy="470" r="31" fill="#56D6FF"/><circle cx="448" cy="470" r="31" fill="#FFB6E8"/>
    <circle cx="360" cy="738" r="42" fill="#F7F0A5" filter="url(#glow03)"/>
    <path d="M195 1047C255 986 465 986 525 1047" stroke="#B5FFA7" stroke-width="15"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M120 414H600M120 545H600M120 676H600M120 807H600" stroke="#7F8DFF" stroke-width="5" opacity=".54"/>
    <path d="M160 350V900M260 350V900M360 350V900M460 350V900M560 350V900" stroke="#7F8DFF" stroke-width="5" opacity=".54"/>
    <path d="M160 807L260 676L360 676L460 545L560 414" stroke="#56D6FF" stroke-width="16" filter="url(#glow04)"/>
    <circle cx="160" cy="807" r="21" fill="#56D6FF"/><circle cx="260" cy="676" r="21" fill="#A3F7EC"/>
    <circle cx="360" cy="676" r="21" fill="#F7F0A5"/><circle cx="460" cy="545" r="21" fill="#FFB6E8"/>
    <rect x="519" y="373" width="82" height="82" rx="18" fill="#342263" stroke="#FFB6E8" stroke-width="8" stroke-dasharray="8 10"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M105 877C176 778 237 679 302 574" stroke="#56D6FF" stroke-width="18"/>
    <path d="M615 877C544 778 483 679 418 574" stroke="#FFB6E8" stroke-width="18"/>
    <path d="M248 980C286 834 326 703 360 556C394 703 434 834 472 980" stroke="#B5FFA7" stroke-width="18"/>
    <path d="M302 574C317 550 341 536 360 536C379 536 403 550 418 574" stroke="#F7F0A5" stroke-width="14" stroke-dasharray="26 16" filter="url(#glow05)"/>
    <circle cx="105" cy="877" r="32" fill="#56D6FF"/><circle cx="615" cy="877" r="32" fill="#FFB6E8"/>
    <circle cx="360" cy="536" r="36" fill="#F7F0A5"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M91 926C182 832 270 786 360 786C450 786 538 832 629 926" stroke="#A3F7EC" stroke-width="11" opacity=".7"/>
    <path d="M164 833A232 232 0 0 1 556 833" stroke="#FFCB83" stroke-width="20" filter="url(#glow06)"/>
    <path d="M208 797A178 178 0 0 1 472 797" stroke="#56D6FF" stroke-width="8" stroke-dasharray="18 18"/>
    <circle cx="360" cy="698" r="74" fill="#F7F0A5" fill-opacity=".22" stroke="#F7F0A5" stroke-width="9"/>
    <path d="M360 621V548M321 638L282 578M399 638L438 578" stroke="#F7F0A5" stroke-width="9"/>
  </g>`,
];

const output = scenes.map((art, offset) => {
  const scene = String(offset + 1).padStart(2, "0");
  const svg = `${sourceDir}/r0028_missing_data_scene_${scene}.svg`;
  const png = `${outputDir}/r0028-missing-data-${scene}.png`;
  writeFileSync(svg, frame(scene, art));
  const result = spawnSync(
    "ffmpeg",
    ["-y", "-i", svg, "-frames:v", "1", "-pix_fmt", "yuv420p", png],
    {
      stdio: "pipe",
    }
  );
  if (result.status !== 0)
    throw new Error(`Scene ${scene} failed: ${result.stderr}`);
  return { scene, svg, png, svgSha256: sha256(svg), pngSha256: sha256(png) };
});

writeFileSync(
  `${assetDir}/REEL-0028_VISUAL_PROVENANCE.json`,
  JSON.stringify(
    {
      reelId: "0028",
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
