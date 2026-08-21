import { describe, expect, it } from "vitest";

describe("Gemini server secret", () => {
  it("authenticates to the Gemini model catalogue without exposing the key", async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    expect(apiKey).toBeTruthy();

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey ?? "")}`,
      { signal: AbortSignal.timeout(12_000) },
    );

    expect(response.ok).toBe(true);
    const payload = await response.json() as { models?: unknown[] };
    expect(Array.isArray(payload.models)).toBe(true);
  }, 20_000);
});
