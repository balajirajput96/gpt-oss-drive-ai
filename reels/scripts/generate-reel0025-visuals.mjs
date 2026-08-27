import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourceDir = "/home/ubuntu/reel-production-assets/REEL-0025/visual-src";
const outputDir = "/home/ubuntu/webdev-static-assets";
const assetDir = "/home/ubuntu/reel-production-assets/REEL-0025";

mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const wrap = (artwork, id) => `
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#211B38"/><stop offset="0.5" stop-color="#44345F"/><stop offset="1" stop-color="#864A43"/></linearGradient>
    <radialGradient id="sun${id}"><stop stop-color="#F6C66D" stop-opacity="0.38"/><stop offset="1" stop-color="#F6C66D" stop-opacity="0"/></radialGradient>
    <linearGradient id="line${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F6C66D"/><stop offset="1" stop-color="#9FE1D4"/></linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#bg${id})"/>
  <circle cx="360" cy="590" r="470" fill="url(#sun${id})"/>
  <g fill="#FFECD1" opacity="0.26"><circle cx="88" cy="192" r="4"/><circle cx="623" cy="154" r="5"/><circle cx="652" cy="986" r="4"/><circle cx="75" cy="1030" r="3"/><circle cx="658" cy="496" r="3"/></g>
  ${artwork}
  <rect x="28" y="28" width="664" height="1224" rx="52" fill="none" stroke="#FFECD1" stroke-opacity="0.24" stroke-width="2"/>
</svg>`;

const scenes = [
  `<circle cx="360" cy="620" r="118" fill="#302C50" stroke="#9FE1D4" stroke-width="10"/><circle cx="360" cy="586" r="33" fill="#F6C66D"/><path d="M292 675C328 642 392 642 428 675M360 738V852" fill="none" stroke="#FFECD1" stroke-width="13" stroke-linecap="round"/><path d="M360 474C262 410 178 428 118 506M360 474C458 410 542 428 602 506M360 474C360 365 360 306 360 228" fill="none" stroke="url(#line01)" stroke-width="16" stroke-linecap="round"/><circle cx="116" cy="508" r="25" fill="#E97C68"/><rect x="332" y="187" width="56" height="56" rx="15" fill="#9FE1D4"/><path d="M542 506l60 0l-30 50z" fill="#F6C66D"/><circle cx="360" cy="620" r="220" fill="none" stroke="#FFECD1" stroke-opacity="0.2" stroke-width="5" stroke-dasharray="12 18"/>`,
  `<circle cx="360" cy="610" r="78" fill="#302C50" stroke="#F6C66D" stroke-width="9"/><circle cx="360" cy="610" r="22" fill="#F6C66D"/><ellipse cx="360" cy="610" rx="236" ry="140" fill="none" stroke="#9FE1D4" stroke-width="10" stroke-dasharray="26 18"/><ellipse cx="360" cy="610" rx="172" ry="262" fill="none" stroke="#E97C68" stroke-width="10" stroke-dasharray="18 21"/><path d="M143 838C232 922 488 922 577 838" fill="none" stroke="#FFECD1" stroke-opacity="0.74" stroke-width="15" stroke-linecap="round"/><circle cx="125" cy="610" r="26" fill="#9FE1D4"/><circle cx="595" cy="610" r="26" fill="#E97C68"/><circle cx="360" cy="348" r="26" fill="#F6C66D"/>`,
  `<path d="M162 778C184 590 258 508 360 508C462 508 536 590 558 778C494 842 226 842 162 778z" fill="#302C50" stroke="#9FE1D4" stroke-width="11"/><ellipse cx="360" cy="700" rx="145" ry="55" fill="none" stroke="#F6C66D" stroke-width="12"/><ellipse cx="360" cy="670" rx="98" ry="36" fill="none" stroke="#FFECD1" stroke-opacity="0.74" stroke-width="10"/><ellipse cx="360" cy="642" rx="48" ry="18" fill="#F6C66D"/><circle cx="360" cy="485" r="32" fill="#E97C68"/><path d="M360 453V280M330 320L360 280L390 320" fill="none" stroke="#9FE1D4" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/><path d="M186 934C266 886 454 886 534 934" fill="none" stroke="#FFECD1" stroke-opacity="0.58" stroke-width="13" stroke-linecap="round"/>`,
  `<circle cx="360" cy="620" r="205" fill="none" stroke="#F6C66D" stroke-width="17" stroke-dasharray="248 35"/><circle cx="360" cy="620" r="146" fill="none" stroke="#9FE1D4" stroke-width="17" stroke-dasharray="170 30" transform="rotate(54 360 620)"/><circle cx="360" cy="620" r="87" fill="none" stroke="#E97C68" stroke-width="17" stroke-dasharray="98 24" transform="rotate(-40 360 620)"/><path d="M360 490L390 590L492 620L390 650L360 750L330 650L228 620L330 590z" fill="#FFECD1" fill-opacity="0.84"/><circle cx="360" cy="620" r="36" fill="#302C50" stroke="#F6C66D" stroke-width="9"/><path d="M152 926C230 866 490 866 568 926" fill="none" stroke="url(#line04)" stroke-width="16" stroke-linecap="round"/>`,
  `<circle cx="285" cy="600" r="170" fill="#302C50" fill-opacity="0.7" stroke="#9FE1D4" stroke-width="11"/><circle cx="435" cy="600" r="170" fill="#302C50" fill-opacity="0.7" stroke="#E97C68" stroke-width="11"/><path d="M318 600C338 566 382 566 402 600C382 634 338 634 318 600z" fill="#F6C66D"/><path d="M175 420L244 365M545 420L476 365M175 780L244 835M545 780L476 835" fill="none" stroke="#FFECD1" stroke-opacity="0.62" stroke-width="13" stroke-linecap="round"/><path d="M147 956C236 892 484 892 573 956" fill="none" stroke="#FFECD1" stroke-opacity="0.62" stroke-width="14" stroke-linecap="round"/><path d="M268 600H452" stroke="#F6C66D" stroke-width="9" stroke-linecap="round" stroke-dasharray="10 15"/>`,
  `<circle cx="360" cy="610" r="104" fill="#302C50" stroke="#9FE1D4" stroke-width="10"/><circle cx="360" cy="576" r="28" fill="#F6C66D"/><path d="M300 671C330 644 390 644 420 671M360 714V814M360 814L302 878M360 814L418 878" fill="none" stroke="#FFECD1" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M214 408C244 322 320 302 360 348C400 302 476 322 506 408C536 494 484 544 430 570" fill="none" stroke="#E97C68" stroke-width="16" stroke-linecap="round"/><circle cx="190" cy="368" r="15" fill="#F6C66D"/><circle cx="530" cy="368" r="15" fill="#9FE1D4"/><path d="M170 1000C248 924 472 924 550 1000" fill="none" stroke="url(#line06)" stroke-width="17" stroke-linecap="round"/><circle cx="360" cy="610" r="250" fill="none" stroke="#FFECD1" stroke-opacity="0.17" stroke-width="5" stroke-dasharray="11 21"/>`,
];

const provenanceScenes = scenes.map((artwork, index) => {
  const scene = String(index + 1).padStart(2, "0");
  const sourcePath = `${sourceDir}/reel0025_scene${scene}.svg`;
  const outputPath = `${outputDir}/reel0025_scene${scene}.png`;
  writeFileSync(sourcePath, wrap(artwork, scene));
  const render = spawnSync(
    "ffmpeg",
    ["-y", "-i", sourcePath, "-frames:v", "1", outputPath],
    { encoding: "utf8" }
  );
  if (render.status !== 0)
    throw new Error(render.stderr || `Scene ${scene} render failed.`);
  return {
    scene,
    sourcePath,
    outputPath,
    source: "original_deterministic_svg",
    containsText: false,
  };
});

writeFileSync(
  `${assetDir}/REEL-0025_VISUAL_PROVENANCE.json`,
  JSON.stringify(
    {
      reelId: "0025",
      canonicalFolderId: "13lsfcptaR3OxMIQxYFC0BhEfv0y-dbDE",
      visualRoute: "original_deterministic_svg_motion_graphics",
      imageGenerationUsed: false,
      quotaOrAccessControlBypass: false,
      reusedLegacyAsset: false,
      embeddedText: false,
      realPersonDepicted: false,
      sceneCount: 6,
      scenes: provenanceScenes,
    },
    null,
    2
  )
);
