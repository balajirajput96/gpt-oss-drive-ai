type GeminiFetch = typeof fetch;

export type GeminiCatalogueStatus =
  | { configured: false }
  | {
      configured: true;
      connected: true;
      modelCount: number;
      provider: "Google Gemini";
    };

export async function getGeminiCatalogueStatus(
  apiKey = process.env.GEMINI_API_KEY,
  request: GeminiFetch = fetch
): Promise<GeminiCatalogueStatus> {
  if (!apiKey) return { configured: false };

  const response = await request(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`,
    { signal: AbortSignal.timeout(12_000) }
  );
  if (!response.ok) throw new Error(`Provider status ${response.status}`);
  const payload = (await response.json()) as {
    models?: Array<{ name?: string }>;
  };
  return {
    configured: true,
    connected: true,
    modelCount: payload.models?.length ?? 0,
    provider: "Google Gemini",
  };
}
