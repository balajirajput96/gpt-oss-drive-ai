import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const src = "/home/ubuntu/reel-production-assets/REEL-0017/visual-src",
  out = "/home/ubuntu/webdev-static-assets";
mkdirSync(src, { recursive: true });
mkdirSync(out, { recursive: true });
const svg = a =>
  `<svg width="720" height="1280" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#0a1630"/><stop offset="1" stop-color="#2e174d"/></linearGradient></defs><rect width="720" height="1280" fill="url(#g)"/><circle cx="360" cy="570" r="342" fill="#72dce1" opacity=".09"/>${a}<rect x="28" y="28" width="664" height="1224" rx="44" fill="none" stroke="#d7fff9" opacity=".2" stroke-width="2"/></svg>`;
const art = [
  `<circle cx="360" cy="570" r="180" fill="none" stroke="#85ece0" stroke-width="10"/><circle cx="360" cy="570" r="104" fill="#233b70"/><path d="M360 390v-70M360 750v70M180 570h-70M540 570h70" stroke="#ffcc79" stroke-width="12"/>`,
  `<path d="M150 680c80-230 180-230 280 0M290 680c80-230 180-230 280 0" fill="none" stroke="#83e9df" stroke-width="10"/><circle cx="285" cy="580" r="48" fill="#ffcc79"/><circle cx="435" cy="580" r="48" fill="#b2a5ff"/>`,
  `<circle cx="285" cy="570" r="72" fill="#223967" stroke="#8dece2" stroke-width="7"/><circle cx="470" cy="500" r="36" fill="#ffcc79" opacity=".4"/><circle cx="510" cy="650" r="36" fill="#b2a5ff" opacity=".35"/><path d="M360 570h180" stroke="#8dece2" stroke-width="12"/>`,
  `<path d="M160 700h400" stroke="#83e9df" stroke-width="12"/><path d="M360 700v-140" stroke="#83e9df" stroke-width="10"/><rect x="220" y="470" width="110" height="85" rx="15" fill="#ffcc79"/><rect x="390" y="470" width="110" height="85" rx="15" fill="#b2a5ff"/>`,
  `<path d="M150 510h250l120 120-120 120H150z" fill="#223967" stroke="#8dece2" stroke-width="8"/><path d="M255 540l90 90-90 90" fill="none" stroke="#ffcc79" stroke-width="13"/>`,
  `<circle cx="325" cy="560" r="138" fill="none" stroke="#8dece2" stroke-width="9"/><path d="M425 670l150 150" stroke="#8dece2" stroke-width="18"/><circle cx="250" cy="500" r="28" fill="#ffcc79"/><circle cx="375" cy="620" r="28" fill="#b2a5ff"/>`,
];
const scenes = [];
for (const [i, a] of art.entries()) {
  const n = String(i + 1).padStart(2, "0"),
    s = `${src}/reel0017_scene${n}.svg`,
    p = `${out}/reel0017_scene${n}.png`;
  writeFileSync(s, svg(a));
  const r = spawnSync("ffmpeg", ["-y", "-i", s, "-frames:v", "1", p], {
    encoding: "utf8",
  });
  if (r.status) throw Error(r.stderr);
  scenes.push({
    scene: n,
    source: "deterministic_svg",
    outputPath: p,
    containsText: false,
  });
}
writeFileSync(
  "/home/ubuntu/reel-production-assets/REEL-0017/visual_provenance.json",
  JSON.stringify(
    {
      reelId: "0017",
      visualRoute: "original_deterministic_svg_motion_graphics",
      embeddedText: false,
      imageGenerationUsed: false,
      quotaOrAccessControlBypass: false,
      scenes,
    },
    null,
    2
  )
);
