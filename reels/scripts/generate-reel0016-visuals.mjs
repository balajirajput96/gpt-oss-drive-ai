import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const src = "/home/ubuntu/reel-production-assets/REEL-0016/visual-src",
  out = "/home/ubuntu/webdev-static-assets";
mkdirSync(src, { recursive: true });
mkdirSync(out, { recursive: true });
const svg = a =>
  `<svg width="720" height="1280" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="#071425"/><stop offset="1" stop-color="#462162"/></linearGradient></defs><rect width="720" height="1280" fill="url(#g)"/><circle cx="360" cy="570" r="340" fill="#76e3d5" opacity=".09"/>${a}<rect x="28" y="28" width="664" height="1224" rx="44" fill="none" stroke="#d7fff9" opacity=".18" stroke-width="2"/></svg>`;
const art = [
  `<rect x="225" y="480" width="270" height="210" rx="32" fill="#18386b" stroke="#a7fff4" stroke-width="6"/><path d="M290 585l45 45 95-105" fill="none" stroke="#ffcf78" stroke-width="14"/>`,
  `<path d="M130 740h160l100-160 100 160h100" fill="none" stroke="#8ce8df" stroke-width="10"/><circle cx="390" cy="580" r="38" fill="#ffcf78"/>`,
  `<circle cx="360" cy="560" r="145" fill="none" stroke="#8ce8df" stroke-width="8"/><circle cx="360" cy="560" r="58" fill="#b5a5ff"/><path d="M360 740v110" stroke="#ffcf78" stroke-width="10"/>`,
  `<path d="M160 760h400" stroke="#8ce8df" stroke-width="10"/><circle cx="240" cy="700" r="36" fill="#ffcf78"/><circle cx="360" cy="620" r="36" fill="#b5a5ff"/><circle cx="480" cy="540" r="36" fill="#73dedf"/>`,
  `<g fill="#18386b" stroke="#bffbf1" stroke-width="5"><rect x="145" y="460" width="180" height="210" rx="26"/><rect x="395" y="460" width="180" height="210" rx="26"/></g><path d="M235 730v100M485 730v100" stroke="#ffcf78" stroke-width="10"/>`,
  `<circle cx="325" cy="570" r="145" fill="none" stroke="#8ce8df" stroke-width="8"/><path d="M430 680l150 150" stroke="#8ce8df" stroke-width="18"/><circle cx="250" cy="500" r="30" fill="#ffcf78"/><circle cx="370" cy="625" r="30" fill="#b5a5ff"/>`,
];
const scenes = [];
for (const [i, a] of art.entries()) {
  const n = String(i + 1).padStart(2, "0"),
    s = `${src}/reel0016_scene${n}.svg`,
    p = `${out}/reel0016_scene${n}.png`;
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
  "/home/ubuntu/reel-production-assets/REEL-0016/visual_provenance.json",
  JSON.stringify(
    {
      reelId: "0016",
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
