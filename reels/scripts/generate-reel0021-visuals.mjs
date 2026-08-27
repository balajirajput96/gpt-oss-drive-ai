import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const sourceDir = "/home/ubuntu/reel-production-assets/REEL-0021/visual-src";
const outputDir = "/home/ubuntu/webdev-static-assets";
mkdirSync(sourceDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const wrap = artwork => `
<svg width="720" height="1280" viewBox="0 0 720 1280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#101632"/>
      <stop offset="0.55" stop-color="#173E61"/>
      <stop offset="1" stop-color="#292058"/>
    </linearGradient>
    <radialGradient id="halo"><stop stop-color="#8EE7DF" stop-opacity="0.20"/><stop offset="1" stop-color="#8EE7DF" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="720" height="1280" fill="url(#background)"/>
  <circle cx="360" cy="600" r="410" fill="url(#halo)"/>
  ${artwork}
  <rect x="28" y="28" width="664" height="1224" rx="44" fill="none" stroke="#E2FCF8" stroke-opacity="0.22" stroke-width="2"/>
</svg>`;

const scenes = [
  `<circle cx="360" cy="570" r="168" fill="none" stroke="#8EE7DF" stroke-width="11"/>
   <circle cx="360" cy="570" r="22" fill="#FFD18B"/>
   <path d="M360 570L510 450M360 570L172 660M360 570L454 760" stroke="#B7AEFF" stroke-width="10" stroke-linecap="round"/>
   <circle cx="510" cy="450" r="30" fill="#B7AEFF"/><circle cx="172" cy="660" r="30" fill="#8EE7DF"/><circle cx="454" cy="760" r="30" fill="#FFD18B"/>`,
  `<path d="M172 770V470Q172 430 212 430H508Q548 430 548 470V770" fill="#173E61" stroke="#8EE7DF" stroke-width="10"/>
   <path d="M240 520H480M240 590H410M240 660H455" stroke="#E2FCF8" stroke-opacity="0.55" stroke-width="12" stroke-linecap="round"/>
   <path d="M510 780L558 830L642 700" fill="none" stroke="#FFD18B" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>`,
  `<rect x="148" y="448" width="424" height="290" rx="58" fill="#173E61" stroke="#8EE7DF" stroke-width="10"/>
   <circle cx="270" cy="590" r="62" fill="#B7AEFF"/><circle cx="450" cy="590" r="62" fill="#FFD18B"/>
   <path d="M328 590H390" stroke="#E2FCF8" stroke-width="14" stroke-linecap="round"/>
   <path d="M186 846C276 770 444 770 534 846" fill="none" stroke="#8EE7DF" stroke-width="12" stroke-linecap="round"/>`,
  `<path d="M160 620H560" stroke="#E2FCF8" stroke-opacity="0.35" stroke-width="10"/>
   <path d="M360 620V850" stroke="#8EE7DF" stroke-width="13"/>
   <path d="M214 512L360 620L506 512" fill="none" stroke="#B7AEFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
   <circle cx="236" cy="512" r="40" fill="#FFD18B"/><circle cx="484" cy="512" r="40" fill="#8EE7DF"/>
   <circle cx="360" cy="875" r="42" fill="#B7AEFF"/>`,
  `<path d="M150 750L300 600L405 705L570 500" fill="none" stroke="#8EE7DF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
   <circle cx="150" cy="750" r="32" fill="#B7AEFF"/><circle cx="300" cy="600" r="32" fill="#FFD18B"/><circle cx="405" cy="705" r="32" fill="#B7AEFF"/><circle cx="570" cy="500" r="32" fill="#8EE7DF"/>
   <circle cx="465" cy="820" r="104" fill="none" stroke="#FFD18B" stroke-width="10"/><path d="M538 894L620 976" stroke="#FFD18B" stroke-width="18" stroke-linecap="round"/>`,
  `<circle cx="360" cy="620" r="172" fill="none" stroke="#8EE7DF" stroke-width="12"/>
   <circle cx="360" cy="620" r="112" fill="none" stroke="#B7AEFF" stroke-width="10"/>
   <circle cx="360" cy="620" r="52" fill="#FFD18B"/>
   <path d="M360 366V314M580 620H632M360 874V926M140 620H88" stroke="#E2FCF8" stroke-width="12" stroke-linecap="round"/>
   <path d="M242 780C314 832 406 832 478 780" fill="none" stroke="#E2FCF8" stroke-opacity="0.65" stroke-width="10" stroke-linecap="round"/>`,
];

const provenanceScenes = [];
for (const [index, artwork] of scenes.entries()) {
  const scene = String(index + 1).padStart(2, "0");
  const sourcePath = `${sourceDir}/reel0021_scene${scene}.svg`;
  const outputPath = `${outputDir}/reel0021_scene${scene}.png`;
  writeFileSync(sourcePath, wrap(artwork));
  const result = spawnSync(
    "ffmpeg",
    ["-y", "-i", sourcePath, "-frames:v", "1", outputPath],
    { encoding: "utf8" }
  );
  if (result.status !== 0)
    throw new Error(result.stderr || `Scene ${scene} render failed.`);
  provenanceScenes.push({
    scene,
    sourcePath,
    outputPath,
    source: "deterministic_svg",
    containsText: false,
  });
}

writeFileSync(
  "/home/ubuntu/reel-production-assets/REEL-0021/visual_provenance.json",
  JSON.stringify(
    {
      reelId: "0021",
      visualRoute: "original_deterministic_svg_motion_graphics",
      imageGenerationUsed: false,
      quotaOrAccessControlBypass: false,
      embeddedText: false,
      reusedLegacyAsset: false,
      scenes: provenanceScenes,
    },
    null,
    2
  )
);
