import { describe, expect, it } from "vitest";
import { buildLLMMessages, createSessionTitle, isSessionOwnedBy } from "./chatUtils";

describe("chat safeguards", () => {
  it("creates concise persistent session titles from user input", () => {
    expect(createSessionTitle("  Explain   this TypeScript function  ")).toBe("Explain this TypeScript function");
    expect(createSessionTitle("")).toBe("New conversation");
    expect(createSessionTitle("a".repeat(80))).toHaveLength(64);
  });

  it("enforces user isolation before session data can be used", () => {
    expect(isSessionOwnedBy(7, 7)).toBe(true);
    expect(isSessionOwnedBy(7, 8)).toBe(false);
  });

  it("preserves ordered user and assistant content for server-side inference", () => {
    expect(buildLLMMessages([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi" },
    ])).toEqual([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi" },
    ]);
  });
});

