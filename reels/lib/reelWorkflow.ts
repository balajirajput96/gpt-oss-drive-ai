import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export type ReelLifecycle = "planned" | "researching" | "scripted" | "assets_ready" | "rendered" | "qc_passed" | "drive_verified";

export type RegistryEntry = {
  reelId: string;
  batch: string;
  pillarCode: string;
  pillar: string;
  lensCode: string;
  lens: string;
  questionCode: string;
  question: string;
  lifecycle: ReelLifecycle;
  evidenceStatus: string;
  driveVerification: string;
};

export type FailureRecord = {
  reelId: string;
  stage: ReelLifecycle;
  errorCategory: string;
  message: string;
  occurredAt: string;
  retryCount: number;
  nextSafeAction: string;
};

export type VerifiedReelRecord = {
  reelId: string;
  driveFolderId: string;
  videoFileId: string;
  scriptFileId: string;
  captionsFileId: string;
  sourcesFileId: string;
  qcFileId: string;
  manifestFileId: string;
  verifiedAt: string;
  sha256?: string;
};

export type DriveArchiveArtifact = {
  name: string;
  fileId: string;
  verifiedAt: string;
};

export type CanonicalReelMapping = {
  driveFolderId: string;
  topic: string;
  status: string;
  legacyNonCanonicalFolderIds?: string[];
};

export type ProductionState = {
  schemaVersion: number;
  targetReelCount: number;
  nextReelId: string | null;
  activeReelId?: string | null;
  completedReelIds: string[];
  verifiedReels?: VerifiedReelRecord[];
  canonicalMappings?: Record<string, CanonicalReelMapping>;
  failedReels: FailureRecord[];
  driveArchiveArtifacts?: DriveArchiveArtifact[];
  lastCheckpointAt: string | null;
  driveRootId: string | null;
  runStatus: "initialized" | "researching" | "blocked" | "ready_for_next" | "complete";
};

export type Program = {
  rootDir: string;
  registry: RegistryEntry[];
  state: ProductionState;
};

const REQUIRED_DOCUMENTS = [
  "RESEARCH_EVIDENCE_RULES.md",
  "REEL_TAXONOMY_AND_QC.md",
  "PILLAR_EVIDENCE_MATRIX.md",
  "PRODUCTION_WORKFLOW.md",
];

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function statePath(rootDir: string) {
  return resolve(rootDir, "reels", "production_state.json");
}

function saveState(rootDir: string, state: ProductionState) {
  const target = statePath(rootDir);
  const temporary = `${target}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`);
  renameSync(temporary, target);
}

function assertProgramIntegrity(program: Program, expectedEntryCount = 3000) {
  const reelIds = program.registry.map(entry => entry.reelId);
  if (program.registry.length !== expectedEntryCount || new Set(reelIds).size !== expectedEntryCount) {
    throw new Error(`Registry must contain ${expectedEntryCount} unique entries.`);
  }
  if (program.state.targetReelCount !== expectedEntryCount) {
    throw new Error("State targetReelCount does not match registry cardinality.");
  }
  for (const completedId of program.state.completedReelIds) {
    if (!reelIds.includes(completedId)) throw new Error(`Completed ID ${completedId} is absent from registry.`);
  }
}

export function loadProgram(rootDir: string, expectedEntryCount = 3000): Program {
  const reelsDir = resolve(rootDir, "reels");
  for (const requiredDocument of REQUIRED_DOCUMENTS) {
    if (!existsSync(resolve(reelsDir, requiredDocument))) {
      throw new Error(`Missing required evidence or workflow document: ${requiredDocument}`);
    }
  }
  const program: Program = {
    rootDir,
    registry: readJson<RegistryEntry[]>(resolve(reelsDir, "reel_registry.json")),
    state: readJson<ProductionState>(resolve(reelsDir, "production_state.json")),
  };
  assertProgramIntegrity(program, expectedEntryCount);
  return program;
}

export function selectNextReel(program: Program): RegistryEntry | null {
  if (!program.state.nextReelId) return null;
  const next = program.registry.find(entry => entry.reelId === program.state.nextReelId);
  if (!next) throw new Error(`nextReelId ${program.state.nextReelId} is absent from registry.`);
  if (program.state.completedReelIds.includes(next.reelId)) {
    throw new Error(`nextReelId ${next.reelId} is already completed; checkpoint is inconsistent.`);
  }
  return next;
}

export function beginNextReel(rootDir: string, expectedEntryCount = 3000) {
  const program = loadProgram(rootDir, expectedEntryCount);
  const next = selectNextReel(program);
  if (!next) return null;
  if (program.state.activeReelId && program.state.activeReelId !== next.reelId) {
    throw new Error(`Active reel ${program.state.activeReelId} must be resolved before starting ${next.reelId}.`);
  }
  program.state.activeReelId = next.reelId;
  program.state.runStatus = "researching";
  program.state.lastCheckpointAt = new Date().toISOString();
  saveState(rootDir, program.state);
  return next;
}

export function recordFailure(rootDir: string, stage: ReelLifecycle, errorCategory: string, message: string, expectedEntryCount = 3000) {
  const program = loadProgram(rootDir, expectedEntryCount);
  const activeReelId = program.state.activeReelId ?? program.state.nextReelId;
  if (!activeReelId) throw new Error("No active reel exists to record a failure.");
  const retryCount = program.state.failedReels.filter(record => record.reelId === activeReelId).length + 1;
  const failure: FailureRecord = {
    reelId: activeReelId,
    stage,
    errorCategory,
    message,
    occurredAt: new Date().toISOString(),
    retryCount,
    nextSafeAction: "Retry the same reel ID after correcting the recorded failure; do not advance the registry.",
  };
  program.state.failedReels.push(failure);
  program.state.activeReelId = activeReelId;
  program.state.runStatus = "blocked";
  program.state.lastCheckpointAt = failure.occurredAt;
  saveState(rootDir, program.state);
  return failure;
}

export function markDriveVerified(rootDir: string, verification: { videoFileId: string; metadataFileId: string; sha256: string; canonicalFolderId?: string }, expectedEntryCount = 3000) {
  if (!verification.videoFileId || !verification.metadataFileId || !verification.sha256) {
    throw new Error("Drive verification requires videoFileId, metadataFileId, and SHA-256 checksum.");
  }
  const program = loadProgram(rootDir, expectedEntryCount);
  const reel = selectNextReel(program);
  if (!reel || program.state.activeReelId !== reel.reelId) {
    throw new Error("The next reel must be active before it can be marked Drive-verified.");
  }
  if (program.state.completedReelIds.includes(reel.reelId)) {
    throw new Error(`Reel ${reel.reelId} is already verified.`);
  }
  const canonicalMapping = program.state.canonicalMappings?.[reel.reelId];
  if (canonicalMapping && verification.canonicalFolderId !== canonicalMapping.driveFolderId) {
    throw new Error(`Reel ${reel.reelId} must be verified in its canonical Drive folder ${canonicalMapping.driveFolderId}.`);
  }
  program.state.completedReelIds.push(reel.reelId);
  program.state.verifiedReels = [
    ...(program.state.verifiedReels ?? []),
    {
      reelId: reel.reelId,
      driveFolderId: verification.canonicalFolderId ?? program.state.driveRootId ?? "unmapped",
      videoFileId: verification.videoFileId,
      scriptFileId: "recorded_in_metadata",
      captionsFileId: "recorded_in_metadata",
      sourcesFileId: "recorded_in_metadata",
      qcFileId: "recorded_in_metadata",
      manifestFileId: verification.metadataFileId,
      verifiedAt: new Date().toISOString(),
      sha256: verification.sha256,
    },
  ];
  const next = program.registry.find(entry => !program.state.completedReelIds.includes(entry.reelId));
  program.state.nextReelId = next?.reelId ?? null;
  program.state.activeReelId = null;
  program.state.runStatus = next ? "ready_for_next" : "complete";
  program.state.lastCheckpointAt = new Date().toISOString();
  saveState(rootDir, program.state);
  return { reel, verification, nextReelId: program.state.nextReelId };
}
