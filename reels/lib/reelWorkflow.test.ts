import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  beginNextReel,
  loadProgram,
  markDriveVerified,
  recordFailure,
  reverifyDriveArtifact,
  selectNextReel,
} from "./reelWorkflow";

const roots: string[] = [];

function makeProgramRoot() {
  const root = mkdtempSync(join(tmpdir(), "reel-workflow-"));
  roots.push(root);
  const reels = join(root, "reels");
  mkdirSync(reels, { recursive: true });
  for (const document of [
    "RESEARCH_EVIDENCE_RULES.md",
    "REEL_TAXONOMY_AND_QC.md",
    "PILLAR_EVIDENCE_MATRIX.md",
    "PRODUCTION_WORKFLOW.md",
  ]) {
    writeFileSync(join(reels, document), "contract");
  }
  const entries = ["0001", "0002", "0003"].map((reelId, index) => ({
    reelId,
    batch: "Batch_001",
    pillarCode: "MND",
    pillar: "Mind",
    lensCode: "L01",
    lens: "Definition",
    questionCode: `Q0${index + 1}`,
    question: "Question",
    lifecycle: "planned",
    evidenceStatus: "not_researched",
    driveVerification: "not_uploaded",
  }));
  writeFileSync(join(reels, "reel_registry.json"), JSON.stringify(entries));
  writeFileSync(
    join(reels, "production_state.json"),
    JSON.stringify({
      schemaVersion: 1,
      targetReelCount: 3,
      nextReelId: "0001",
      completedReelIds: [],
      failedReels: [],
      lastCheckpointAt: null,
      driveRootId: "drive-root",
      runStatus: "initialized",
    })
  );
  return root;
}

afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe("reel production workflow", () => {
  it("selects the deterministic next ID and keeps it after a failure", () => {
    const root = makeProgramRoot();
    expect(selectNextReel(loadProgram(root, 3))?.reelId).toBe("0001");
    expect(beginNextReel(root, 3)?.reelId).toBe("0001");
    const failure = recordFailure(
      root,
      "researching",
      "source_unavailable",
      "Source requires retry",
      3
    );
    expect(failure.reelId).toBe("0001");
    const state = JSON.parse(
      readFileSync(join(root, "reels", "production_state.json"), "utf8")
    );
    expect(state.nextReelId).toBe("0001");
    expect(state.runStatus).toBe("blocked");
  });

  it("advances only after complete Drive-verification evidence and never duplicates IDs", () => {
    const root = makeProgramRoot();
    beginNextReel(root, 3);
    expect(() =>
      markDriveVerified(
        root,
        { videoFileId: "", metadataFileId: "meta", sha256: "hash" },
        3
      )
    ).toThrow("Drive verification");
    const result = markDriveVerified(
      root,
      { videoFileId: "video-1", metadataFileId: "meta-1", sha256: "hash-1" },
      3
    );
    expect(result.nextReelId).toBe("0002");
    const state = JSON.parse(
      readFileSync(join(root, "reels", "production_state.json"), "utf8")
    );
    expect(state.completedReelIds).toEqual(["0001"]);
    expect(state.nextReelId).toBe("0002");
  });

  it("requires the configured canonical Drive folder before marking a mapped reel verified", () => {
    const root = makeProgramRoot();
    const statePath = join(root, "reels", "production_state.json");
    const state = JSON.parse(readFileSync(statePath, "utf8"));
    state.canonicalMappings = {
      "0001": {
        driveFolderId: "canonical-folder",
        topic: "Canonical topic",
        status: "researching",
      },
    };
    writeFileSync(statePath, JSON.stringify(state));
    beginNextReel(root, 3);
    expect(() =>
      markDriveVerified(
        root,
        {
          videoFileId: "video-1",
          metadataFileId: "meta-1",
          sha256: "hash-1",
          canonicalFolderId: "legacy-folder",
        },
        3
      )
    ).toThrow("canonical Drive folder");
    markDriveVerified(
      root,
      {
        videoFileId: "video-1",
        metadataFileId: "meta-1",
        sha256: "hash-1",
        canonicalFolderId: "canonical-folder",
      },
      3
    );
    const verifiedState = JSON.parse(readFileSync(statePath, "utf8"));
    expect(verifiedState.verifiedReels[0].driveFolderId).toBe(
      "canonical-folder"
    );
    expect(verifiedState.canonicalMappings["0001"].status).toBe(
      "drive_verified"
    );
  });

  it("re-verifies a corrected completed artifact without duplicating or advancing IDs", () => {
    const root = makeProgramRoot();
    beginNextReel(root, 3);
    markDriveVerified(
      root,
      {
        videoFileId: "video-1",
        metadataFileId: "meta-1",
        sha256: "hash-1",
        canonicalFolderId: "canonical-folder",
      },
      3
    );
    const statePath = join(root, "reels", "production_state.json");
    const state = JSON.parse(readFileSync(statePath, "utf8"));
    state.canonicalMappings = {
      "0001": {
        driveFolderId: "canonical-folder",
        topic: "Canonical topic",
        status: "drive_verified",
      },
    };
    writeFileSync(statePath, JSON.stringify(state));
    expect(() =>
      reverifyDriveArtifact(
        root,
        "0001",
        {
          videoFileId: "video-2",
          metadataFileId: "meta-2",
          sha256: "hash-2",
          canonicalFolderId: "legacy-folder",
        },
        3
      )
    ).toThrow("canonical Drive folder");
    const result = reverifyDriveArtifact(
      root,
      "0001",
      {
        videoFileId: "video-2",
        metadataFileId: "meta-2",
        sha256: "hash-2",
        canonicalFolderId: "canonical-folder",
      },
      3
    );
    const corrected = JSON.parse(readFileSync(statePath, "utf8"));
    expect(result.nextReelId).toBe("0002");
    expect(corrected.completedReelIds).toEqual(["0001"]);
    expect(corrected.verifiedReels).toHaveLength(1);
    expect(corrected.verifiedReels[0]).toMatchObject({
      videoFileId: "video-2",
      manifestFileId: "meta-2",
      sha256: "hash-2",
    });
    expect(corrected.nextReelId).toBe("0002");
  });
});
