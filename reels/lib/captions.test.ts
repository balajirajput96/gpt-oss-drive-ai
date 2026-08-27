import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { validateSrt } from "./captions";

const validSrt = `1
00:00:00,000 --> 00:00:01,000
नमस्ते

2
00:00:01,000 --> 00:00:02,000
दुनिया`;

describe("caption validation", () => {
  it("accepts non-overlapping Hindi captions within the video duration", () => {
    expect(validateSrt(validSrt, 2_000)).toEqual({
      cueCount: 2,
      maxEndMs: 2_000,
    });
  });

  it("rejects overlapping cues", () => {
    expect(() =>
      validateSrt(
        validSrt.replace(
          "00:00:01,000 --> 00:00:02,000",
          "00:00:00,900 --> 00:00:02,000"
        )
      )
    ).toThrow("overlaps");
  });

  it("rejects cues beyond the video duration and captions without Devanagari", () => {
    expect(() => validateSrt(validSrt, 1_999)).toThrow(
      "exceeds the video duration"
    );
    expect(() =>
      validateSrt(validSrt.replace("दुनिया", "world"), 2_000)
    ).toThrow("Devanagari");
  });

  it("keeps the corrected Reel 0019 captions ordered, non-overlapping, Hindi, and within its verified duration", () => {
    const reel0019 = readFileSync(
      resolve(process.cwd(), "reels/output/REEL-0019/REEL-0019_captions.srt"),
      "utf8"
    );
    expect(validateSrt(reel0019, 62_333)).toEqual({
      cueCount: 7,
      maxEndMs: 62_200,
    });
  });

  it("keeps the active Reel 0021 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0021 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0021/REEL-0021_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0021, 51_760)).toEqual({
      cueCount: 6,
      maxEndMs: 51_500,
    });
  });

  it("keeps Reel 0022 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0022 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0022/REEL-0022_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0022, 71_160)).toEqual({
      cueCount: 15,
      maxEndMs: 71_160,
    });
  });

  it("keeps Reel 0023 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0023 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0023/REEL-0023_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0023, 64_810)).toEqual({
      cueCount: 16,
      maxEndMs: 64_594,
    });
  });

  it("keeps Reel 0024 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0024 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0024/REEL-0024_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0024, 66_120)).toEqual({
      cueCount: 15,
      maxEndMs: 66_100,
    });
  });

  it("keeps Reel 0025 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0025 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0025/REEL-0025_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0025, 62_000)).toEqual({
      cueCount: 15,
      maxEndMs: 62_000,
    });
  });

  it("keeps Reel 0026 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0026 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0026/REEL-0026_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0026, 55_720)).toEqual({
      cueCount: 11,
      maxEndMs: 55_700,
    });
  });

  it("keeps Reel 0027 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0027 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0027/REEL-0027_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0027, 61_600)).toEqual({
      cueCount: 12,
      maxEndMs: 61_500,
    });
  });

  it("keeps Reel 0028 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0028 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0028/REEL-0028_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0028, 64_280)).toEqual({
      cueCount: 13,
      maxEndMs: 64_100,
    });
  });

  it("keeps Reel 0029 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0029 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0029/REEL-0029_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0029, 61_920)).toEqual({
      cueCount: 13,
      maxEndMs: 61_800,
    });
  });

  it("keeps Reel 0030 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0030 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0030/REEL-0030_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0030, 57_200)).toEqual({
      cueCount: 12,
      maxEndMs: 57_100,
    });
  });

  it("keeps active Reel 0031 captions ordered, non-overlapping, Hindi, and within its verified narration duration", () => {
    const reel0031 = readFileSync(
      resolve(
        process.cwd(),
        "reels/output/REEL-0031/REEL-0031_CAPTIONS_HI.srt"
      ),
      "utf8"
    );
    expect(validateSrt(reel0031, 62_200)).toEqual({
      cueCount: 12,
      maxEndMs: 62_000,
    });
  });
});
