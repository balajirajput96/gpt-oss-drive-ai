import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourceDir = "/home/ubuntu/reel-production-assets/REEL-0014/visual-src";
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });
const frame = (id, art) =>
  `<?xml version="1.0" encoding="UTF-8"?><svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071425"/><stop offset=".55" stop-color="#162858"/><stop offset="1" stop-color="#38205d"/></linearGradient><radialGradient id="r${id}"><stop stop-color="#77e3da" stop-opacity=".32"/><stop offset="1" stop-color="#77e3da" stop-opacity="0"/></radialGradient></defs><rect width="720" height="1280" fill="url(#g${id})"/><circle cx="360" cy="530" r="360" fill="url(#r${id})"/>${art}<rect x="28" y="28" width="664" height="1224" rx="44" fill="none" stroke="#d7fff9" stroke-opacity=".17" stroke-width="2"/></svg>`;
const scenes = [
  frame(
    1,
    `<g transform="translate(110 340)" fill="#18396a" stroke="#a8f1e8" stroke-width="5"><circle cx="250" cy="220" r="150"/><path d="M250 70v45M392 150l-38 28M402 300l-45-20M250 370v-45M98 300l45-20M108 150l38 28"/></g><g fill="#ffcf78"><circle cx="360" cy="410" r="23"/><circle cx="505" cy="560" r="18"/><circle cx="215" cy="560" r="18"/></g>`
  ),
  frame(
    2,
    `<g fill="none" stroke="#85e5dc" stroke-width="6"><path d="M360 310v110M360 420L170 610M360 420l190 190M170 610v170M550 610v170"/></g><g fill="#173660" stroke="#d1fff7" stroke-width="4"><circle cx="360" cy="300" r="58"/><rect x="110" y="780" width="120" height="110" rx="26"/><rect x="490" y="780" width="120" height="110" rx="26"/><circle cx="360" cy="620" r="62"/></g>`
  ),
  frame(
    3,
    `<g transform="translate(105 270)" fill="#1b3767" stroke="#86e8df" stroke-width="4"><rect width="210" height="150" rx="30"/><rect x="300" width="210" height="150" rx="30"/><rect y="250" width="210" height="150" rx="30"/><rect x="300" y="250" width="210" height="150" rx="30"/></g><g fill="#ffce7b"><circle cx="210" cy="345" r="24"/><circle cx="510" cy="345" r="24"/><circle cx="210" cy="595" r="24"/><circle cx="510" cy="595" r="24"/></g>`
  ),
  frame(
    4,
    `<g fill="none" stroke-width="6"><path d="M110 620C210 350 295 890 360 620S510 350 610 620" stroke="#80e5db"/><path d="M110 770C220 1040 292 500 360 770s150 270 250 0" stroke="#bba8ff"/></g><circle cx="360" cy="700" r="92" fill="#1b3b70" stroke="#ffcf78" stroke-width="6"/>`
  ),
  frame(
    5,
    `<g transform="translate(85 350)" fill="#193666" stroke="#bdf8f0" stroke-width="5"><path d="M0 0h230v300H0z"/><path d="M320 0h230v300H320z"/></g><g fill="#ffce7b"><circle cx="200" cy="500" r="44"/><circle cx="520" cy="500" r="44"/></g><path d="M240 760h240" stroke="#8be8df" stroke-width="7" stroke-linecap="round"/>`
  ),
  frame(
    6,
    `<g fill="none" stroke="#8ce7de" stroke-width="6"><circle cx="310" cy="560" r="150"/><path d="M420 670l130 130M525 760l75 75"/></g><g fill="#18376a" stroke="#d8fff9" stroke-width="4"><rect x="155" y="420" width="145" height="110" rx="22"/><rect x="385" y="420" width="145" height="110" rx="22"/><circle cx="270" cy="770" r="44"/></g><circle cx="450" cy="770" r="44" fill="#ffcf78"/>`
  ),
];
const provenance = {
  reelId: "0014",
  visualRoute: "original_deterministic_svg_motion_graphics",
  embeddedText: false,
  imageGenerationUsed: false,
  quotaOrAccessControlBypass: false,
  scenes: [],
};
for (const [index, svg] of scenes.entries()) {
  const number = String(index + 1).padStart(2, "0");
  const source = `${sourceDir}/reel0014_scene${number}.svg`;
  const output = `${outputDir}/reel0014_scene${number}.png`;
  writeFileSync(source, svg);
  const run = spawnSync(
    "ffmpeg",
    ["-y", "-i", source, "-frames:v", "1", output],
    { encoding: "utf8" }
  );
  if (run.status !== 0) throw new Error(run.stderr);
  provenance.scenes.push({
    scene: number,
    source: "deterministic_svg",
    sourcePath: source,
    outputPath: output,
    containsText: false,
  });
}
writeFileSync(
  "/home/ubuntu/reel-production-assets/REEL-0014/visual_provenance.json",
  `${JSON.stringify(provenance, null, 2)}\n`
);
console.log(JSON.stringify(provenance, null, 2));
