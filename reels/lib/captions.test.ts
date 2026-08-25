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
});
