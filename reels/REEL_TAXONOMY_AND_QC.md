# 3,000 Hindi Research Reels — Taxonomy, Identity, and QC Contract

## Scope boundary

This is a **planned topic registry**, not a claim library. A planned identifier becomes production-eligible only after its particular script has a source ledger and passes the evidence rules in `RESEARCH_EVIDENCE_RULES.md`. The registry deliberately separates scientific evidence, live professional debate, philosophy, and spirituality so that no tradition or personal belief is presented as neuroscience proof.

## Unique identity model

The catalogue uses 10 pillars, 10 explanatory lenses, and 30 distinct question templates. Their Cartesian product gives **3,000 unique production briefs**. Each reel receives one immutable ID from `0001` through `3000`; Drive batch `Batch_001` contains `0001`–`0030`, `Batch_002` contains `0031`–`0060`, and so on through `Batch_100`.

| Pillar code | Topic pillar | Examples of eligible source types |
|---|---|---|
| MND | Attention, mind, and consciousness | Cognitive science reviews; philosophy attributed to its source |
| NBR | Brain, neurons, and neuroplasticity | Neuroscience reviews; no causal overstatement from imaging |
| MEM | Memory and learning | Cognitive-science experiments and meta-analyses |
| SLP | Sleep, recovery, and performance | Sleep-science systematic reviews and consensus sources |
| EMO | Emotions and emotion regulation | Meta-analyses; clinical framing reviewed for safety |
| HAB | Habits, motivation, and behavior change | Behavioral-science reviews and trials |
| DEC | Judgment, bias, and decision making | Decision-science reviews; practical examples labeled as examples |
| REL | Relationships, communication, and social connection | Developmental/social psychology reviews |
| MED | Meditation, self-awareness, and contemplative practice | Trials/reviews plus clearly attributed contemplative traditions |
| PHS | Philosophy, values, meaning, and spiritual perspectives | Primary texts, credible scholarship, and explicit belief labels |

| Lens code | Distinct lens | Required safety framing |
|---|---|---|
| L01 | Core definition | Define terms before using them metaphorically. |
| L02 | Common misconception | State exactly what evidence does and does not show. |
| L03 | Everyday observation | Label a scenario as illustrative, not data. |
| L04 | Mechanism | Mark unsettled mechanisms as hypothesis. |
| L05 | Evidence comparison | Compare evidence types, population, and limits. |
| L06 | Practical experiment | Low-risk, non-clinical, optional reflection only. |
| L07 | Boundary condition | Explain when the idea may not generalize. |
| L08 | History of an idea | Attribute thinker, tradition, or researcher. |
| L09 | Cross-cultural perspective | Avoid universalizing one culture’s concept. |
| L10 | Ethical implication | Distinguish normative argument from empirical fact. |

## Thirty question templates

Each pillar–lens brief takes the next unused question template in a deterministic rotating order: (1) “यह वास्तव में क्या है?”, (2) “इसका सबसे आम भ्रम क्या है?”, (3) “हम इसे रोज़मर्रा में कैसे पहचानते हैं?”, (4) “इसके पीछे प्रस्तावित तंत्र क्या है?”, (5) “कौन-सा प्रमाण सबसे मजबूत है?”, (6) “किस बात पर शोध सहमत नहीं है?”, (7) “कौन-सा छोटा, सुरक्षित अवलोकन किया जा सकता है?”, (8) “यह आदत क्यों कठिन लगती है?”, (9) “संदर्भ इसे कैसे बदलता है?”, (10) “क्या यह कारण है या केवल संबंध?”, (11) “भाषा इसे कैसे प्रभावित करती है?”, (12) “समय के साथ यह कैसे बदलता है?”, (13) “किस समूह पर निष्कर्ष लागू हुआ?”, (14) “नापने में कठिनाई क्या है?”, (15) “कौन-सी वैकल्पिक व्याख्या संभव है?”, (16) “छोटी सफलता क्यों मायने रखती है?”, (17) “कौन-सी सीमा उपयोगी है?”, (18) “क्या विशेषज्ञों में मतभेद है?”, (19) “प्रौद्योगिकी इसे कैसे बदलती है?”, (20) “नींद/तनाव/पर्यावरण की भूमिका क्या है?”, (21) “हम अपने अनुमान कैसे जाँच सकते हैं?”, (22) “इसे नैतिक रूप से कैसे समझें?”, (23) “यह पहचान और भूमिका से कैसे जुड़ता है?”, (24) “कब सहायता लेना ठीक है?”, (25) “इस परंपरा का दृष्टिकोण क्या है?”, (26) “विज्ञान इससे क्या अलग कहता है?”, (27) “क्या छोटा परिवर्तन व्यवहार्य है?”, (28) “कौन-सा डेटा अभी गायब है?”, (29) “इससे जिज्ञासा कैसे बढ़ती है?”, और (30) “मुख्य सीख क्या है?”

The production index uses the formula `Pillar × Lens × Question`. For example, Reel `0001` is `MND-L01-Q01`; Reel `0002` is `MND-L01-Q02`; Reel `0031` is `MND-L02-Q01`; Reel `0301` is `NBR-L01-Q01`; and Reel `3000` is `PHS-L10-Q30`. Before writing, the scheduler must resolve the ID to this tuple and record a human-readable topic title that has not already been used.

## Per-reel deliverable contract

| Artifact | Required condition for QC pass |
|---|---|
| `NNNN_script_hi.md` | Hindi, 55–65 seconds at the selected voice pace; source tags on every externally verifiable claim; clear hook, explanation, limitation, and close. |
| `NNNN_claims.json` | At least one primary or synthesis source per factual claim; evidence label; DOI/URL; access date; uncertainty language. |
| `NNNN_voice.wav` | Clear Hindi narration, no clipped phrases, no fabricated expert voice, and no personally identifying imitation. |
| `NNNN_captions.srt` | Synchronized Hindi captions; legible on a 9:16 mobile frame; no unsupported claims added in captions. |
| `NNNN_reel.mp4` | H.264/AAC, portrait 9:16, target duration 55–65 seconds, visual safe area preserved, licensed/generated assets logged. |
| `NNNN_qc.json` | Machine checks, content checks, Drive file ID, Drive metadata verification timestamp, SHA-256 checksum, and state `verified`. |

## Mandatory QC gates

Every item must pass: **unique-ID check**, **source retrievability check**, **claim-to-source traceability**, **science-vs-belief label check**, **Hindi narration/caption consistency**, **duration/aspect-ratio/audio checks**, **no diagnosis or cure language**, **copyright/asset provenance check**, **Drive upload verification**, and **checkpoint update**. Failure records stay in the ledger with a clear retry reason; they are never silently skipped.

### Evidence anchors

[1] [Singh B, Murphy R, Maher C, Smith AE. *Time to Form a Habit*. Healthcare, 2024.](https://pmc.ncbi.nlm.nih.gov/articles/PMC11641623/)

[2] [Newbury CR, Crowley R, Rastle K, Tamminen J. *Sleep Deprivation and Memory*. Psychological Bulletin, 2021.](https://pmc.ncbi.nlm.nih.gov/articles/PMC8893218/)

[3] [Goyal M, Singh S, Sibinga EMS, et al. *Meditation Programs for Psychological Stress and Well-being*. JAMA Internal Medicine, 2014.](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1809754)
