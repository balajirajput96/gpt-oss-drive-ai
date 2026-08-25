import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(moduleDir, "..");

const pillars = [
  ["MND", "Attention, mind, and consciousness"],
  ["NBR", "Brain, neurons, and neuroplasticity"],
  ["MEM", "Memory and learning"],
  ["SLP", "Sleep, recovery, and performance"],
  ["EMO", "Emotions and emotion regulation"],
  ["HAB", "Habits, motivation, and behavior change"],
  ["DEC", "Judgment, bias, and decision making"],
  ["REL", "Relationships, communication, and social connection"],
  ["MED", "Meditation, self-awareness, and contemplative practice"],
  ["PHS", "Philosophy, values, meaning, and spiritual perspectives"],
];

const lenses = [
  ["L01", "Core definition"],
  ["L02", "Common misconception"],
  ["L03", "Everyday observation"],
  ["L04", "Mechanism"],
  ["L05", "Evidence comparison"],
  ["L06", "Practical experiment"],
  ["L07", "Boundary condition"],
  ["L08", "History of an idea"],
  ["L09", "Cross-cultural perspective"],
  ["L10", "Ethical implication"],
];

const questions = [
  "यह वास्तव में क्या है?",
  "इसका सबसे आम भ्रम क्या है?",
  "हम इसे रोज़मर्रा में कैसे पहचानते हैं?",
  "इसके पीछे प्रस्तावित तंत्र क्या है?",
  "कौन-सा प्रमाण सबसे मजबूत है?",
  "किस बात पर शोध सहमत नहीं है?",
  "कौन-सा छोटा, सुरक्षित अवलोकन किया जा सकता है?",
  "यह आदत क्यों कठिन लगती है?",
  "संदर्भ इसे कैसे बदलता है?",
  "क्या यह कारण है या केवल संबंध?",
  "भाषा इसे कैसे प्रभावित करती है?",
  "समय के साथ यह कैसे बदलता है?",
  "किस समूह पर निष्कर्ष लागू हुआ?",
  "नापने में कठिनाई क्या है?",
  "कौन-सी वैकल्पिक व्याख्या संभव है?",
  "छोटी सफलता क्यों मायने रखती है?",
  "कौन-सी सीमा उपयोगी है?",
  "क्या विशेषज्ञों में मतभेद है?",
  "प्रौद्योगिकी इसे कैसे बदलती है?",
  "नींद, तनाव, या पर्यावरण की भूमिका क्या है?",
  "हम अपने अनुमान कैसे जाँच सकते हैं?",
  "इसे नैतिक रूप से कैसे समझें?",
  "यह पहचान और भूमिका से कैसे जुड़ता है?",
  "कब सहायता लेना ठीक है?",
  "इस परंपरा का दृष्टिकोण क्या है?",
  "विज्ञान इससे क्या अलग कहता है?",
  "क्या छोटा परिवर्तन व्यवहार्य है?",
  "कौन-सा डेटा अभी गायब है?",
  "इससे जिज्ञासा कैसे बढ़ती है?",
  "मुख्य सीख क्या है?",
];

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

const entries = [];
let id = 1;
for (const [pillarCode, pillar] of pillars) {
  for (const [lensCode, lens] of lenses) {
    for (
      let questionIndex = 0;
      questionIndex < questions.length;
      questionIndex += 1
    ) {
      const reelId = String(id).padStart(4, "0");
      entries.push({
        reelId,
        batch: `Batch_${String(Math.ceil(id / 30)).padStart(3, "0")}`,
        pillarCode,
        pillar,
        lensCode,
        lens,
        questionCode: `Q${String(questionIndex + 1).padStart(2, "0")}`,
        question: questions[questionIndex],
        lifecycle: "planned",
        evidenceStatus: "not_researched",
        driveVerification: "not_uploaded",
      });
      id += 1;
    }
  }
}

if (
  entries.length !== 3000 ||
  new Set(entries.map(entry => entry.reelId)).size !== 3000
) {
  throw new Error("Registry integrity check failed.");
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  resolve(outputDir, "reel_registry.json"),
  `${JSON.stringify(entries, null, 2)}\n`
);
const header = Object.keys(entries[0]);
const csv = [
  header.map(csvCell).join(","),
  ...entries.map(entry => header.map(key => csvCell(entry[key])).join(",")),
].join("\n");
writeFileSync(resolve(outputDir, "reel_registry.csv"), `${csv}\n`);
writeFileSync(
  resolve(outputDir, "production_state.json"),
  `${JSON.stringify(
    {
      schemaVersion: 1,
      targetReelCount: 3000,
      nextReelId: "0001",
      completedReelIds: [],
      failedReels: [],
      lastCheckpointAt: null,
      driveRootId: null,
      runStatus: "initialized",
    },
    null,
    2
  )}\n`
);

console.log(`Generated ${entries.length} reel entries.`);
