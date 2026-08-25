import { describe, expect, it } from "vitest";
import { getGeminiCatalogueStatus } from "./geminiHealth";

describe("Gemini server configuration", () => {
  it("reports missing configuration without making a network request", async () => {
    const request = async () => {
      throw new Error("network request should not be made");
    };
    await expect(
      getGeminiCatalogueStatus("", request as typeof fetch)
    ).resolves.toEqual({ configured: false });
  });

  it("uses a server-side key only to request the model catalogue", async () => {
    const calls: string[] = [];
    const request = async (input: RequestInfo | URL) => {
      calls.push(String(input));
      return new Response(
        JSON.stringify({
          models: [{ name: "models/a" }, { name: "models/b" }],
        }),
        { status: 200 }
      );
    };
    await expect(
      getGeminiCatalogueStatus("server-only-key", request as typeof fetch)
    ).resolves.toEqual({
      configured: true,
      connected: true,
      modelCount: 2,
      provider: "Google Gemini",
    });
    expect(calls).toEqual([expect.stringContaining("key=server-only-key")]);
  });

  it("rejects a failed provider response", async () => {
    const request = async () => new Response("unavailable", { status: 503 });
    await expect(
      getGeminiCatalogueStatus("server-only-key", request as typeof fetch)
    ).rejects.toThrow("Provider status 503");
  });
});
