import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const assetDir = "/home/ubuntu/reel-production-assets/REEL-0031";
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
      <stop stop-color="#160D24"/>
      <stop offset=".48" stop-color="#253B53"/>
      <stop offset="1" stop-color="#16565C"/>
    </linearGradient>
    <radialGradient id="aura${scene}" cx="50%" cy="34%" r="63%">
      <stop stop-color="#F0AA5D" stop-opacity=".35"/>
      <stop offset=".56" stop-color="#42D4C9" stop-opacity=".12"/>
      <stop offset="1" stop-color="#160D24" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ribbon${scene}" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#4EE2D5" stop-opacity=".22"/>
      <stop offset="1" stop-color="#F0AA5D" stop-opacity=".78"/>
    </linearGradient>
    <filter id="glow${scene}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="13" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="720" height="1280" fill="url(#ground${scene})"/>
  <circle cx="360" cy="426" r="410" fill="url(#aura${scene})"/>
  <path d="M0 1110C126 1052 247 1101 360 1060C485 1014 587 1068 720 1021V1280H0Z" fill="#0D1726" fill-opacity=".8"/>
  ${art}
</svg>`;

const scenes = [
  `<g fill="none" stroke-linecap="round">
    <circle cx="151" cy="416" r="35" fill="#A85C78" fill-opacity=".34" stroke="#D37A92" stroke-width="8"/>
    <circle cx="539" cy="438" r="45" fill="#42D4C9" fill-opacity=".18" stroke="#73EDE4" stroke-width="8"/>
    <circle cx="193" cy="700" r="52" fill="#42D4C9" fill-opacity=".16" stroke="#73EDE4" stroke-width="9"/>
    <circle cx="520" cy="744" r="38" fill="#A85C78" fill-opacity=".35" stroke="#D37A92" stroke-width="8"/>
    <circle cx="360" cy="582" r="125" stroke="#F0AA5D" stroke-width="17" stroke-dasharray="23 19" filter="url(#glow01)"/>
    <circle cx="360" cy="582" r="46" fill="#F0AA5D" fill-opacity=".24" stroke="#FFE0A7" stroke-width="12"/>
    <path d="M153 416C221 477 255 525 316 563M539 438C480 484 445 532 402 565M193 700C250 668 285 628 316 601M520 744C465 691 432 642 404 603" stroke="#8CEBE4" stroke-width="8" stroke-opacity=".56"/>
  </g>`,
  `<g fill="none" stroke-linejoin="round">
    <path d="M125 826L225 352L496 352L595 826Z" fill="#42D4C9" fill-opacity=".10" stroke="#7EF2E8" stroke-width="11"/>
    <path d="M225 352L360 250L496 352M225 352L360 856L496 352" stroke="#A5FFF6" stroke-width="7" stroke-opacity=".62"/>
    <ellipse cx="360" cy="580" rx="132" ry="225" fill="#F0AA5D" fill-opacity=".16" stroke="#F0AA5D" stroke-width="16" filter="url(#glow02)"/>
    <path d="M360 338C410 429 413 720 360 820C307 720 310 429 360 338Z" fill="#FFE0A7" fill-opacity=".24"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M127 447H295V615H127Z" stroke="#73EDE4" stroke-width="11" stroke-dasharray="16 12"/>
    <path d="M451 394L561 451L521 572L397 553L365 431Z" fill="#A85C78" fill-opacity=".23" stroke="#D37A92" stroke-width="11"/>
    <path d="M144 784C198 690 268 778 316 687C350 623 396 726 431 652C466 578 518 645 580 590" stroke="#F0AA5D" stroke-width="16"/>
    <circle cx="360" cy="675" r="87" fill="#42D4C9" fill-opacity=".15" stroke="#A5FFF6" stroke-width="13" filter="url(#glow03)"/>
    <path d="M214 532C258 585 298 622 329 640M449 503C426 564 397 612 384 638M322 690L269 741M398 690L472 679" stroke="#E7FFFF" stroke-width="8" stroke-opacity=".7"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M105 822C170 744 188 590 255 520C304 469 342 470 370 511C402 558 432 605 483 559C537 510 550 393 618 340" stroke="#52DDD2" stroke-width="18" stroke-opacity=".43"/>
    <path d="M105 822C177 745 192 641 255 588C317 536 330 637 389 657C451 678 492 585 545 512C571 476 595 414 618 340" stroke="#F0AA5D" stroke-width="15" filter="url(#glow04)"/>
    <circle cx="166" cy="758" r="37" fill="#A85C78" fill-opacity=".5" stroke="#F2A1B4" stroke-width="9"/>
    <circle cx="545" cy="512" r="44" fill="#F0AA5D" fill-opacity=".23" stroke="#FFE0A7" stroke-width="12"/>
    <circle cx="618" cy="340" r="24" fill="#A5FFF6"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <path d="M185 440C110 548 166 734 306 750C420 763 485 659 443 557C410 477 290 393 185 440Z" stroke="#73EDE4" stroke-width="14" stroke-dasharray="25 16"/>
    <path d="M527 450C610 557 553 727 423 751C320 770 238 677 275 574C306 492 418 400 527 450Z" stroke="#D37A92" stroke-width="14" stroke-dasharray="12 20"/>
    <path d="M360 312V922" stroke="#F0AA5D" stroke-width="17" filter="url(#glow05)"/>
    <circle cx="360" cy="548" r="100" fill="#F0AA5D" fill-opacity=".12" stroke="#FFE0A7" stroke-width="10"/>
    <circle cx="360" cy="548" r="27" fill="#FFE0A7"/>
  </g>`,
  `<g fill="none" stroke-linecap="round">
    <circle cx="360" cy="522" r="241" stroke="#73EDE4" stroke-width="10" stroke-dasharray="8 25" opacity=".68"/>
    <circle cx="360" cy="522" r="171" stroke="#D37A92" stroke-width="12" stroke-dasharray="23 16" opacity=".72"/>
    <path d="M360 242L493 665H227Z" fill="#F0AA5D" fill-opacity=".14" stroke="#F0AA5D" stroke-width="14" filter="url(#glow06)"/>
    <circle cx="360" cy="470" r="56" fill="#FFE0A7" fill-opacity=".34" stroke="#FFE0A7" stroke-width="11"/>
    <path d="M144 912C222 851 296 889 360 824C423 889 502 851 576 912" stroke="#A5FFF6" stroke-width="13" stroke-opacity=".74"/>
  </g>`,
];

const output = scenes.map((art, offset) => {
  const scene = String(offset + 1).padStart(2, "0");
  const svg = `${sourceDir}/r0031_attention_selective_scene_${scene}.svg`;
  const png = `${outputDir}/r0031-attention-selective-${scene}.png`;
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
  `${assetDir}/REEL-0031_VISUAL_PROVENANCE.json`,
  `${JSON.stringify(
    {
      reelId: "0031",
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
