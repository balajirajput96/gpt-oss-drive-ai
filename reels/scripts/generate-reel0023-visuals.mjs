import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourceDir = "/home/ubuntu/reel-production-assets/REEL-0023/visual-src";
const outputDir = "/home/ubuntu/webdev-static-assets";
const assetDir = "/home/ubuntu/reel-production-assets/REEL-0023";

mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const wrap = (artwork, id) => `
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#10283A"/><stop offset="0.52" stop-color="#1F4562"/><stop offset="1" stop-color="#103B48"/></linearGradient>
    <radialGradient id="halo${id}"><stop stop-color="#F5CA77" stop-opacity="0.25"/><stop offset="1" stop-color="#F5CA77" stop-opacity="0"/></radialGradient>
    <linearGradient id="path${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8FE1D4"/><stop offset="1" stop-color="#F09A82"/></linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#bg${id})"/>
  <circle cx="360" cy="620" r="400" fill="url(#halo${id})"/>
  <g fill="#D8FBF4" opacity="0.22"><circle cx="86" cy="210" r="4"/><circle cx="642" cy="236" r="5"/><circle cx="110" cy="1034" r="4"/><circle cx="624" cy="970" r="4"/><circle cx="662" cy="702" r="3"/><circle cx="72" cy="756" r="3"/></g>
  ${artwork}
  <rect x="28" y="28" width="664" height="1224" rx="52" fill="none" stroke="#D8FBF4" stroke-opacity="0.25" stroke-width="2"/>
</svg>`;

const scenes = [
  `<circle cx="360" cy="588" r="136" fill="#153B57" stroke="#8FE1D4" stroke-width="12"/><circle cx="360" cy="564" r="48" fill="#F5CA77"/><path d="M252 752C282 686 322 654 360 654C398 654 438 686 468 752" fill="#153B57" stroke="#D8FBF4" stroke-opacity="0.72" stroke-width="10" stroke-linecap="round"/><circle cx="150" cy="430" r="25" fill="#F09A82"/><circle cx="570" cy="430" r="25" fill="#8FE1D4"/><circle cx="152" cy="770" r="25" fill="#8FE1D4"/><circle cx="568" cy="770" r="25" fill="#F09A82"/><circle cx="360" cy="316" r="24" fill="#F5CA77"/><path d="M172 438L275 514M548 438L445 514M174 762L271 663M546 762L449 663M360 340V428" stroke="url(#path01)" stroke-width="15" stroke-linecap="round"/><circle cx="360" cy="588" r="206" fill="none" stroke="#D8FBF4" stroke-opacity="0.38" stroke-width="4" stroke-dasharray="12 18"/>`,
  `<path d="M360 804V496" stroke="#F5CA77" stroke-width="15" stroke-linecap="round"/><circle cx="360" cy="808" r="52" fill="#153B57" stroke="#D8FBF4" stroke-width="10"/><path d="M360 560C290 510 225 468 145 448M360 560C430 510 495 468 575 448" stroke="#8FE1D4" stroke-width="14" stroke-linecap="round"/><circle cx="130" cy="442" r="74" fill="#153B57" stroke="#8FE1D4" stroke-width="10"/><path d="M104 462C119 422 147 404 174 438" fill="none" stroke="#F5CA77" stroke-width="11" stroke-linecap="round"/><circle cx="590" cy="442" r="74" fill="#153B57" stroke="#F09A82" stroke-width="10"/><path d="M560 462C576 426 608 426 620 468M574 474L612 432" fill="none" stroke="#F5CA77" stroke-width="11" stroke-linecap="round"/><path d="M196 962C255 906 465 906 524 962" fill="none" stroke="#D8FBF4" stroke-opacity="0.62" stroke-width="12" stroke-linecap="round"/>`,
  `<circle cx="360" cy="600" r="92" fill="#153B57" stroke="#F5CA77" stroke-width="12"/><circle cx="360" cy="600" r="34" fill="#F09A82"/><circle cx="190" cy="448" r="92" fill="#153B57" stroke="#8FE1D4" stroke-width="11"/><circle cx="530" cy="448" r="92" fill="#153B57" stroke="#8FE1D4" stroke-width="11"/><circle cx="190" cy="820" r="92" fill="#153B57" stroke="#8FE1D4" stroke-width="11"/><circle cx="530" cy="820" r="92" fill="#153B57" stroke="#8FE1D4" stroke-width="11"/><path d="M294 552L250 505M426 552L470 505M294 648L250 763M426 648L470 763" stroke="url(#path03)" stroke-width="15" stroke-linecap="round"/><path d="M174 448H206M190 432V464M514 448H546M530 432V464M174 820H206M190 804V836M514 820H546M530 804V836" stroke="#D8FBF4" stroke-opacity="0.78" stroke-width="8" stroke-linecap="round"/><circle cx="360" cy="600" r="170" fill="none" stroke="#D8FBF4" stroke-opacity="0.22" stroke-width="6"/>`,
  `<path d="M174 524H546" stroke="#D8FBF4" stroke-opacity="0.44" stroke-width="12" stroke-linecap="round"/><path d="M360 524V812" stroke="#8FE1D4" stroke-width="14" stroke-linecap="round"/><path d="M220 438L360 524L500 438" fill="none" stroke="#F5CA77" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="220" cy="438" r="48" fill="#F09A82"/><circle cx="500" cy="438" r="48" fill="#8FE1D4"/><circle cx="360" cy="856" r="68" fill="#153B57" stroke="#F5CA77" stroke-width="10"/><path d="M255 964C286 927 326 908 360 908C394 908 434 927 465 964" fill="none" stroke="#F09A82" stroke-opacity="0.7" stroke-width="12" stroke-linecap="round"/><path d="M286 856H434" stroke="#D8FBF4" stroke-opacity="0.82" stroke-width="10" stroke-linecap="round"/><circle cx="360" cy="524" r="28" fill="#F5CA77"/>`,
  `<path d="M188 842C222 716 298 650 360 650C422 650 498 716 532 842" fill="#153B57" fill-opacity="0.78" stroke="#8FE1D4" stroke-width="10"/><circle cx="360" cy="506" r="78" fill="none" stroke="#F5CA77" stroke-width="13"/><path d="M280 506C300 447 328 416 360 394C392 416 420 447 440 506" fill="none" stroke="#F09A82" stroke-width="13" stroke-linecap="round"/><path d="M360 428V346M294 448L228 390M426 448L492 390" stroke="#D8FBF4" stroke-opacity="0.7" stroke-width="10" stroke-linecap="round"/><circle cx="360" cy="334" r="18" fill="#8FE1D4"/><circle cx="216" cy="380" r="18" fill="#F5CA77"/><circle cx="504" cy="380" r="18" fill="#F09A82"/><path d="M188 914C255 856 465 856 532 914" fill="none" stroke="#D8FBF4" stroke-opacity="0.46" stroke-width="12" stroke-linecap="round"/><path d="M304 986C334 1004 386 1004 416 986" fill="none" stroke="#F5CA77" stroke-width="10" stroke-linecap="round"/>`,
  `<rect x="112" y="428" width="218" height="330" rx="34" fill="#153B57" stroke="#8FE1D4" stroke-width="10"/><rect x="390" y="522" width="218" height="330" rx="34" fill="#153B57" stroke="#F09A82" stroke-width="10"/><circle cx="221" cy="580" r="46" fill="#F5CA77"/><circle cx="499" cy="674" r="46" fill="#8FE1D4"/><path d="M151 678C188 632 253 632 291 678M429 772C466 726 531 726 569 772" fill="none" stroke="#D8FBF4" stroke-opacity="0.76" stroke-width="11" stroke-linecap="round"/><path d="M328 816C355 856 377 878 420 900C463 922 488 950 488 1004" fill="none" stroke="url(#path06)" stroke-width="17" stroke-linecap="round"/><circle cx="488" cy="1030" r="23" fill="#F5CA77"/><path d="M182 924C252 886 328 886 390 914" fill="none" stroke="#D8FBF4" stroke-opacity="0.42" stroke-width="10" stroke-linecap="round"/><circle cx="360" cy="618" r="245" fill="none" stroke="#D8FBF4" stroke-opacity="0.16" stroke-width="5" stroke-dasharray="10 20"/>`,
];

const provenanceScenes = scenes.map((artwork, index) => {
  const scene = String(index + 1).padStart(2, "0");
  const sourcePath = `${sourceDir}/reel0023_scene${scene}.svg`;
  const outputPath = `${outputDir}/reel0023_scene${scene}.png`;
  writeFileSync(sourcePath, wrap(artwork, scene));
  const render = spawnSync(
    "ffmpeg",
    ["-y", "-i", sourcePath, "-frames:v", "1", outputPath],
    { encoding: "utf8" }
  );
  if (render.status !== 0) {
    throw new Error(render.stderr || `Scene ${scene} render failed.`);
  }
  return {
    scene,
    sourcePath,
    outputPath,
    source: "original_deterministic_svg",
    containsText: false,
  };
});

writeFileSync(
  `${assetDir}/REEL-0023_VISUAL_PROVENANCE.json`,
  JSON.stringify(
    {
      reelId: "0023",
      canonicalFolderId: "1h02qFM96T3DCmaXaoTKa4ZAUgwuS3evp",
      visualRoute: "original_deterministic_svg_motion_graphics",
      imageGenerationUsed: false,
      quotaOrAccessControlBypass: false,
      reusedLegacyAsset: false,
      embeddedText: false,
      sceneCount: 6,
      scenes: provenanceScenes,
    },
    null,
    2
  )
);
