import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourceDir = "/home/ubuntu/reel-production-assets/REEL-0011/visual-src";
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const background = (id, content) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071425"/><stop offset="0.54" stop-color="#111f48"/><stop offset="1" stop-color="#2a1350"/></linearGradient>
    <radialGradient id="glow${id}" cx="50%" cy="44%" r="55%"><stop stop-color="#66e4da" stop-opacity=".38"/><stop offset="1" stop-color="#66e4da" stop-opacity="0"/></radialGradient>
    <filter id="blur${id}"><feGaussianBlur stdDeviation="14"/></filter>
  </defs>
  <rect width="720" height="1280" fill="url(#bg${id})"/>
  <circle cx="360" cy="530" r="350" fill="url(#glow${id})"/>
  ${content}
  <rect x="28" y="28" width="664" height="1224" rx="44" fill="none" stroke="#bdeee9" stroke-opacity=".18" stroke-width="2"/>
</svg>`;

const scenes = [
  background(
    "01",
    `
    <g fill="#8de8e0" opacity=".34">
      <circle cx="162" cy="414" r="22"/><circle cx="278" cy="310" r="16"/><circle cx="452" cy="350" r="25"/><circle cx="555" cy="504" r="19"/><circle cx="276" cy="652" r="18"/><circle cx="450" cy="735" r="24"/>
    </g>
    <g stroke="#79ded8" stroke-opacity=".42" stroke-width="3"><path d="M162 414L278 310 452 350 555 504 450 735 276 652Z" fill="none"/><path d="M278 310L276 652M452 350L450 735"/></g>
    <circle cx="452" cy="350" r="84" fill="none" stroke="#ffce7b" stroke-width="5"/><circle cx="452" cy="350" r="108" fill="none" stroke="#ffce7b" stroke-opacity=".35" stroke-width="2"/>
    <path d="M112 946C208 852 512 852 608 946" stroke="#b4a2ff" stroke-width="3" fill="none" opacity=".6"/>
  `
  ),
  background(
    "02",
    `
    <g stroke="#a8f0e4" stroke-width="4" fill="#132c57">
      <path d="M112 400l46-38 62 24 4 70-54 33-61-29z"/><path d="M280 280l52-35 57 28 0 67-54 36-56-28z"/><path d="M486 365l51-34 62 27 2 68-53 39-57-31z"/>
      <path d="M144 664l50-33 59 28 2 67-56 37-57-31z"/><path d="M355 704l52-35 61 28 0 70-57 36-59-31z"/><path d="M511 575l51-35 58 27 2 69-55 36-56-31z"/>
    </g>
    <g fill="#ffcf76"><circle cx="170" cy="419" r="14"/><circle cx="335" cy="306" r="14"/><circle cx="546" cy="393" r="14"/><circle cx="199" cy="693" r="14"/><circle cx="411" cy="734" r="14"/><circle cx="568" cy="605" r="14"/></g>
    <circle cx="360" cy="512" r="210" fill="none" stroke="#e6f8f4" stroke-opacity=".22" stroke-width="2" stroke-dasharray="12 16"/>
  `
  ),
  background(
    "03",
    `
    <g transform="translate(100 250)"><rect width="520" height="110" rx="32" fill="#1b3465" stroke="#89e5dc" stroke-opacity=".55" stroke-width="3"/><rect y="165" width="520" height="110" rx="32" fill="#1b3465" stroke="#89e5dc" stroke-opacity=".32" stroke-width="3"/><rect y="330" width="520" height="110" rx="32" fill="#1b3465" stroke="#89e5dc" stroke-opacity=".32" stroke-width="3"/>
    <circle cx="74" cy="55" r="31" fill="#ffcc76"/><circle cx="238" cy="55" r="26" fill="#7edfd7"/><circle cx="420" cy="55" r="20" fill="#b7a5ff"/>
    <circle cx="74" cy="220" r="22" fill="#7edfd7" opacity=".55"/><circle cx="238" cy="220" r="32" fill="#ffcc76" opacity=".55"/><circle cx="420" cy="220" r="20" fill="#b7a5ff" opacity=".55"/>
    <circle cx="74" cy="385" r="22" fill="#7edfd7" opacity=".4"/><circle cx="238" cy="385" r="20" fill="#b7a5ff" opacity=".4"/><circle cx="420" cy="385" r="34" fill="#ffcc76" opacity=".4"/></g>
    <path d="M360 830v156" stroke="#ffcc76" stroke-width="5"/><path d="M328 954l32 32 32-32" fill="none" stroke="#ffcc76" stroke-width="5"/>
  `
  ),
  background(
    "04",
    `
    <g fill="none" stroke-width="5"><path d="M124 360C244 360 230 600 360 600S476 360 596 360" stroke="#77e0d7"/><path d="M124 810C244 810 230 600 360 600S476 810 596 810" stroke="#b8a6ff"/></g>
    <circle cx="124" cy="360" r="46" fill="#15345f" stroke="#77e0d7" stroke-width="4"/><circle cx="124" cy="810" r="46" fill="#15345f" stroke="#b8a6ff" stroke-width="4"/>
    <circle cx="360" cy="600" r="72" fill="#1d3d72" stroke="#ffce7b" stroke-width="6"/><circle cx="596" cy="585" r="42" fill="#1d3d72" stroke="#d0f8f2" stroke-width="4"/>
    <path d="M596 627v190" stroke="#d0f8f2" stroke-width="5"/><path d="M562 783l34 34 34-34" fill="none" stroke="#d0f8f2" stroke-width="5"/>
  `
  ),
  background(
    "05",
    `
    <path d="M135 600C135 402 285 286 470 328 606 358 644 496 594 602" fill="none" stroke="#76e1d9" stroke-width="8" opacity=".7"/>
    <path d="M160 620C208 762 334 855 493 830" fill="none" stroke="#b8a7ff" stroke-width="8" opacity=".65"/>
    <path d="M486 335c100 24 164 112 152 213" fill="none" stroke="#ffce7b" stroke-width="8" opacity=".72"/>
    <g fill="#d2fff8"><circle cx="135" cy="600" r="18"/><circle cx="470" cy="328" r="18"/><circle cx="594" cy="602" r="18"/><circle cx="493" cy="830" r="18"/><circle cx="270" cy="806" r="18"/></g>
    <ellipse cx="360" cy="592" rx="96" ry="54" fill="#0d1d42" stroke="#ffce7b" stroke-width="6"/><circle cx="360" cy="592" r="20" fill="#ffce7b"/>
  `
  ),
  background(
    "06",
    `
    <g transform="translate(165 330)"><path d="M125 40h141c42 0 75 33 75 75v220c0 42-33 75-75 75H125c-42 0-75-33-75-75V115c0-42 33-75 75-75z" fill="#17335f" stroke="#a8f0e4" stroke-width="6"/><path d="M341 130h42c44 0 79 36 79 80v74c0 44-35 80-79 80h-42" fill="none" stroke="#a8f0e4" stroke-width="6"/><path d="M86 0c28 66 34 104 0 168" fill="none" stroke="#b7a5ff" stroke-width="8" stroke-linecap="round"/>
    <circle cx="125" cy="182" r="16" fill="#ffce7b"/><circle cx="194" cy="124" r="16" fill="#76e1d9"/><circle cx="255" cy="240" r="16" fill="#b7a5ff"/><circle cx="202" cy="310" r="16" fill="#ffce7b"/></g>
    <circle cx="360" cy="970" r="78" fill="none" stroke="#d5f9f4" stroke-opacity=".36" stroke-width="3" stroke-dasharray="8 14"/>
  `
  ),
];

const provenance = {
  reelId: "0011",
  visualRoute: "original_deterministic_svg_motion_graphics",
  embeddedText: false,
  imageGenerationUsed: false,
  quotaOrAccessControlBypass: false,
  scenes: [],
};
for (const [index, svg] of scenes.entries()) {
  const scene = String(index + 1).padStart(2, "0");
  const svgPath = `${sourceDir}/reel0011_scene${scene}.svg`;
  const pngPath = `${outputDir}/reel0011_scene${scene}.png`;
  writeFileSync(svgPath, svg);
  const conversion = spawnSync(
    "ffmpeg",
    ["-y", "-i", svgPath, "-vf", "format=rgba", "-frames:v", "1", pngPath],
    { encoding: "utf8" }
  );
  if (conversion.status !== 0)
    throw new Error(conversion.stderr || `Could not rasterize scene ${scene}`);
  provenance.scenes.push({
    scene,
    source: "deterministic_svg",
    sourcePath: svgPath,
    outputPath: pngPath,
    containsText: false,
  });
}
writeFileSync(
  "/home/ubuntu/reel-production-assets/REEL-0011/visual_provenance.json",
  `${JSON.stringify(provenance, null, 2)}\n`
);
console.log(JSON.stringify(provenance, null, 2));
