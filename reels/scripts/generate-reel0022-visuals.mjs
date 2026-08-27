import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourceDir = "/home/ubuntu/reel-production-assets/REEL-0022/visual-src";
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const wrap = (artwork, id) => `
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#160F32"/><stop offset="0.52" stop-color="#213F62"/><stop offset="1" stop-color="#123D47"/></linearGradient>
    <radialGradient id="glow${id}"><stop stop-color="#F4B860" stop-opacity="0.24"/><stop offset="1" stop-color="#F4B860" stop-opacity="0"/></radialGradient>
    <linearGradient id="beam${id}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#73D9D0" stop-opacity="0"/><stop offset="0.48" stop-color="#73D9D0" stop-opacity="0.84"/><stop offset="1" stop-color="#F28A7D" stop-opacity="0"/></linearGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#bg${id})"/>
  <circle cx="360" cy="605" r="430" fill="url(#glow${id})"/>
  <g opacity="0.24" fill="#C7FBF4"><circle cx="94" cy="194" r="4"/><circle cx="624" cy="222" r="5"/><circle cx="586" cy="960" r="3"/><circle cx="118" cy="1024" r="5"/><circle cx="665" cy="676" r="3"/><circle cx="90" cy="744" r="3"/></g>
  ${artwork}
  <rect x="28" y="28" width="664" height="1224" rx="52" fill="none" stroke="#DFFBF5" stroke-opacity="0.22" stroke-width="2"/>
</svg>`;

const scenes = [
  `<path d="M128 890C190 786 264 752 360 752C456 752 530 786 592 890" fill="none" stroke="#DFFBF5" stroke-opacity="0.45" stroke-width="11" stroke-linecap="round"/><circle cx="360" cy="575" r="146" fill="none" stroke="#73D9D0" stroke-width="12"/><circle cx="360" cy="575" r="74" fill="#F4B860" fill-opacity="0.9"/><path d="M106 408C180 448 229 492 286 535M614 408C540 448 491 492 434 535M126 714C205 686 248 650 286 615M594 714C515 686 472 650 434 615" stroke="url(#beam01)" stroke-width="26" stroke-linecap="round"/><circle cx="116" cy="404" r="18" fill="#F28A7D"/><circle cx="604" cy="404" r="18" fill="#73D9D0"/><circle cx="136" cy="720" r="18" fill="#73D9D0"/><circle cx="584" cy="720" r="18" fill="#F28A7D"/><path d="M360 722V892" stroke="#F4B860" stroke-width="13" stroke-linecap="round"/>`,
  `<path d="M169 848V438Q169 404 203 404H517Q551 404 551 438V848" fill="#1A3558" fill-opacity="0.72" stroke="#73D9D0" stroke-width="10"/><path d="M223 508H497M223 590H435M223 672H474" stroke="#DFFBF5" stroke-opacity="0.62" stroke-width="13" stroke-linecap="round"/><path d="M264 896L360 800L456 896" fill="none" stroke="#F4B860" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><circle cx="360" cy="800" r="32" fill="#F28A7D"/><path d="M259 987H461" stroke="#73D9D0" stroke-width="12" stroke-linecap="round"/><circle cx="251" cy="987" r="21" fill="#73D9D0"/><circle cx="469" cy="987" r="21" fill="#73D9D0"/>`,
  `<path d="M360 484V854" stroke="#F4B860" stroke-width="15" stroke-linecap="round"/><path d="M360 614L166 462M360 614L554 462M360 760L166 932M360 760L554 932" stroke="#73D9D0" stroke-width="14" stroke-linecap="round"/><circle cx="360" cy="618" r="58" fill="#F28A7D"/><circle cx="360" cy="618" r="22" fill="#F4B860"/><circle cx="148" cy="450" r="62" fill="#1A3558" stroke="#73D9D0" stroke-width="10"/><circle cx="572" cy="450" r="62" fill="#1A3558" stroke="#73D9D0" stroke-width="10"/><circle cx="148" cy="944" r="62" fill="#1A3558" stroke="#73D9D0" stroke-width="10"/><circle cx="572" cy="944" r="62" fill="#1A3558" stroke="#73D9D0" stroke-width="10"/><path d="M132 450H164M148 434V466M556 450H588M572 434V466M132 944H164M148 928V960M556 944H588M572 928V960" stroke="#DFFBF5" stroke-opacity="0.76" stroke-width="8" stroke-linecap="round"/>`,
  `<path d="M178 550H542" stroke="#DFFBF5" stroke-opacity="0.3" stroke-width="10"/><path d="M360 550V821" stroke="#73D9D0" stroke-width="13"/><path d="M210 470L360 550L510 470" fill="none" stroke="#F4B860" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><circle cx="226" cy="470" r="46" fill="#F28A7D"/><circle cx="494" cy="470" r="46" fill="#73D9D0"/><circle cx="360" cy="850" r="63" fill="#1A3558" stroke="#F4B860" stroke-width="10"/><path d="M320 850H400M360 810V890" stroke="#DFFBF5" stroke-width="10" stroke-linecap="round"/><path d="M157 698C237 638 483 638 563 698" fill="none" stroke="#F28A7D" stroke-opacity="0.56" stroke-width="11" stroke-linecap="round"/><circle cx="360" cy="550" r="32" fill="#F4B860"/>`,
  `<path d="M190 806C216 675 296 605 360 605C424 605 504 675 530 806" fill="#1A3558" fill-opacity="0.66" stroke="#73D9D0" stroke-width="10"/><path d="M274 702C254 620 278 522 360 466C442 522 466 620 446 702" fill="none" stroke="#F4B860" stroke-width="12" stroke-linecap="round"/><circle cx="360" cy="408" r="44" fill="#F28A7D"/><circle cx="204" cy="490" r="46" fill="#1A3558" stroke="#DFFBF5" stroke-opacity="0.7" stroke-width="9"/><path d="M204 468V512M182 490H226" stroke="#73D9D0" stroke-width="8" stroke-linecap="round"/><circle cx="516" cy="490" r="46" fill="#1A3558" stroke="#DFFBF5" stroke-opacity="0.7" stroke-width="9"/><path d="M493 490H539M516 467V513" stroke="#F4B860" stroke-width="8" stroke-linecap="round"/><circle cx="230" cy="904" r="46" fill="#1A3558" stroke="#DFFBF5" stroke-opacity="0.7" stroke-width="9"/><circle cx="230" cy="904" r="16" fill="#73D9D0"/><circle cx="490" cy="904" r="46" fill="#1A3558" stroke="#DFFBF5" stroke-opacity="0.7" stroke-width="9"/><path d="M469 904L484 920L514 886" fill="none" stroke="#F28A7D" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<path d="M128 930C191 819 265 784 360 784C455 784 529 819 592 930" fill="none" stroke="#DFFBF5" stroke-opacity="0.45" stroke-width="12" stroke-linecap="round"/><circle cx="360" cy="621" r="150" fill="none" stroke="#73D9D0" stroke-width="12"/><circle cx="360" cy="621" r="92" fill="none" stroke="#F4B860" stroke-width="10"/><circle cx="360" cy="621" r="38" fill="#F28A7D"/><path d="M360 470V312M489 492L592 388M511 621H660M489 750L592 854M360 772V930M231 750L128 854M209 621H60M231 492L128 388" stroke="#DFFBF5" stroke-opacity="0.6" stroke-width="11" stroke-linecap="round"/><circle cx="360" cy="312" r="14" fill="#F4B860"/><circle cx="592" cy="388" r="14" fill="#73D9D0"/><circle cx="660" cy="621" r="14" fill="#F28A7D"/><circle cx="592" cy="854" r="14" fill="#73D9D0"/><circle cx="360" cy="930" r="14" fill="#F4B860"/><circle cx="128" cy="854" r="14" fill="#73D9D0"/><circle cx="60" cy="621" r="14" fill="#F28A7D"/><circle cx="128" cy="388" r="14" fill="#73D9D0"/><path d="M301 1042C337 1065 383 1065 419 1042" fill="none" stroke="#F4B860" stroke-width="11" stroke-linecap="round"/>`,
];

const provenanceScenes = scenes.map((artwork, index) => {
  const scene = String(index + 1).padStart(2, "0");
  const sourcePath = `${sourceDir}/reel0022_scene${scene}.svg`;
  const outputPath = `${outputDir}/reel0022_scene${scene}.png`;
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
  "/home/ubuntu/reel-production-assets/REEL-0022/REEL-0022_VISUAL_PROVENANCE.json",
  JSON.stringify(
    {
      reelId: "0022",
      canonicalFolderId: "1F1NbhWGNY-_a-QfOUm50CE2rooBxlRWB",
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
