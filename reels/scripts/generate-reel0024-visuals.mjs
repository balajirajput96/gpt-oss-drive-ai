import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourceDir = "/home/ubuntu/reel-production-assets/REEL-0024/visual-src";
const outputDir = "/home/ubuntu/webdev-static-assets";
const assetDir = "/home/ubuntu/reel-production-assets/REEL-0024";

mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });
mkdirSync(assetDir, { recursive: true });

const wrap = (artwork, id) => `
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#211B40"/><stop offset="0.52" stop-color="#304568"/><stop offset="1" stop-color="#1E504F"/></linearGradient>
    <radialGradient id="halo${id}"><stop stop-color="#F3C875" stop-opacity="0.28"/><stop offset="1" stop-color="#F3C875" stop-opacity="0"/></radialGradient>
    <linearGradient id="route${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#A6E4DD"/><stop offset="1" stop-color="#E99EAA"/></linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#bg${id})"/>
  <circle cx="360" cy="620" r="420" fill="url(#halo${id})"/>
  <g fill="#E1F8F2" opacity="0.22"><circle cx="86" cy="220" r="4"/><circle cx="630" cy="210" r="4"/><circle cx="98" cy="1008" r="4"/><circle cx="624" cy="1036" r="5"/><circle cx="660" cy="708" r="3"/><circle cx="65" cy="752" r="3"/></g>
  ${artwork}
  <rect x="28" y="28" width="664" height="1224" rx="52" fill="none" stroke="#E1F8F2" stroke-opacity="0.24" stroke-width="2"/>
</svg>`;

const scenes = [
  `<circle cx="360" cy="565" r="106" fill="#263D62" stroke="#A6E4DD" stroke-width="12"/><circle cx="360" cy="542" r="34" fill="#F3C875"/><path d="M323 615C340 592 380 592 397 615" fill="none" stroke="#E1F8F2" stroke-width="10" stroke-linecap="round"/><path d="M360 671V795M360 795L280 875M360 795L440 875" stroke="url(#route01)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><circle cx="234" cy="918" r="42" fill="#E99EAA"/><circle cx="486" cy="918" r="42" fill="#A6E4DD"/><path d="M215 367C268 321 452 321 505 367" fill="none" stroke="#F3C875" stroke-width="12" stroke-linecap="round"/><circle cx="360" cy="565" r="190" fill="none" stroke="#E1F8F2" stroke-opacity="0.28" stroke-width="5" stroke-dasharray="12 18"/>`,
  `<rect x="128" y="385" width="464" height="460" rx="48" fill="#263D62" stroke="#A6E4DD" stroke-width="10"/><circle cx="234" cy="520" r="54" fill="#F3C875"/><path d="M192 566H276M234 478V562" stroke="#263D62" stroke-width="10" stroke-linecap="round"/><path d="M354 490H506M354 560H506M354 630H470" stroke="#E1F8F2" stroke-opacity="0.75" stroke-width="15" stroke-linecap="round"/><path d="M200 735H520" stroke="url(#route02)" stroke-width="18" stroke-linecap="round"/><circle cx="200" cy="735" r="18" fill="#E99EAA"/><circle cx="520" cy="735" r="18" fill="#A6E4DD"/><path d="M224 926C294 872 426 872 496 926" fill="none" stroke="#F3C875" stroke-opacity="0.78" stroke-width="14" stroke-linecap="round"/>`,
  `<path d="M175 820C217 686 292 620 360 620C428 620 503 686 545 820" fill="#263D62" fill-opacity="0.86" stroke="#A6E4DD" stroke-width="11"/><path d="M360 612V402" stroke="#F3C875" stroke-width="16" stroke-linecap="round"/><path d="M360 404L292 478M360 404L428 478" fill="none" stroke="#F3C875" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><rect x="266" y="285" width="188" height="120" rx="38" fill="#263D62" stroke="#E99EAA" stroke-width="10"/><circle cx="360" cy="345" r="28" fill="#E99EAA"/><path d="M214 924C278 880 442 880 506 924" fill="none" stroke="#E1F8F2" stroke-opacity="0.62" stroke-width="13" stroke-linecap="round"/><circle cx="360" cy="626" r="212" fill="none" stroke="#E1F8F2" stroke-opacity="0.20" stroke-width="5"/>`,
  `<path d="M154 770V470C154 420 194 380 244 380H292C342 380 382 420 382 470V770" fill="#263D62" stroke="#A6E4DD" stroke-width="10"/><path d="M434 850V550C434 500 474 460 524 460H544C594 460 634 500 634 550V850" fill="#263D62" stroke="#E99EAA" stroke-width="10"/><circle cx="268" cy="554" r="38" fill="#F3C875"/><circle cx="534" cy="634" r="38" fill="#A6E4DD"/><path d="M205 670C238 632 298 632 331 670M471 750C504 712 564 712 597 750" fill="none" stroke="#E1F8F2" stroke-opacity="0.78" stroke-width="11" stroke-linecap="round"/><path d="M382 732C406 760 425 784 454 806" fill="none" stroke="url(#route04)" stroke-width="16" stroke-linecap="round"/><path d="M155 942C260 902 458 902 566 942" fill="none" stroke="#F3C875" stroke-opacity="0.7" stroke-width="13" stroke-linecap="round"/>`,
  `<circle cx="360" cy="642" r="92" fill="#F3C875"/><path d="M260 477C188 524 170 626 218 696M460 477C532 524 550 626 502 696M240 798C302 850 418 850 480 798" fill="none" stroke="#E99EAA" stroke-opacity="0.72" stroke-width="16" stroke-linecap="round"/><path d="M248 470L292 512M472 470L428 512M220 694L278 670M500 694L442 670M242 798L302 754M478 798L418 754" stroke="#E1F8F2" stroke-opacity="0.72" stroke-width="10" stroke-linecap="round"/><circle cx="360" cy="642" r="218" fill="none" stroke="#A6E4DD" stroke-width="7" stroke-dasharray="22 16"/><path d="M208 958C278 906 442 906 512 958" fill="none" stroke="url(#route05)" stroke-width="17" stroke-linecap="round"/>`,
  `<rect x="182" y="400" width="232" height="292" rx="38" fill="#263D62" stroke="#A6E4DD" stroke-width="10"/><path d="M240 486H356M240 548H330M240 610H304" stroke="#E1F8F2" stroke-opacity="0.8" stroke-width="13" stroke-linecap="round"/><path d="M414 614C470 654 500 704 500 788C500 870 540 920 584 952" fill="none" stroke="url(#route06)" stroke-width="18" stroke-linecap="round"/><circle cx="590" cy="958" r="34" fill="#F3C875"/><path d="M510 432C565 484 584 568 558 638" fill="none" stroke="#E99EAA" stroke-width="13" stroke-linecap="round"/><circle cx="542" cy="398" r="22" fill="#E99EAA"/><path d="M154 900C228 846 360 834 476 874" fill="none" stroke="#E1F8F2" stroke-opacity="0.46" stroke-width="12" stroke-linecap="round"/><circle cx="360" cy="642" r="286" fill="none" stroke="#E1F8F2" stroke-opacity="0.15" stroke-width="5" stroke-dasharray="10 20"/>`,
];

const provenanceScenes = scenes.map((artwork, index) => {
  const scene = String(index + 1).padStart(2, "0");
  const sourcePath = `${sourceDir}/reel0024_scene${scene}.svg`;
  const outputPath = `${outputDir}/reel0024_scene${scene}.png`;
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
  `${assetDir}/REEL-0024_VISUAL_PROVENANCE.json`,
  JSON.stringify(
    {
      reelId: "0024",
      canonicalFolderId: "1Ypox8YV6-DKU6wVaWMrt-nrJ9GfSBi31",
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
