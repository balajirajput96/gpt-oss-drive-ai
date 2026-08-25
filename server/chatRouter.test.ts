import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

type SessionRecord = {
  id: number;
  userId: number;
  title: string;
  model: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type MessageRecord = {
  id: number;
  sessionId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

const state = vi.hoisted(() => ({
  sessions: [] as SessionRecord[],
  messages: [] as MessageRecord[],
  nextSessionId: 1,
  nextMessageId: 1,
}));

vi.mock("./db", () => ({
  listChatSessions: async (userId: number) =>
    state.sessions.filter(session => session.userId === userId),
  getChatSession: async (userId: number, sessionId: number) =>
    state.sessions.find(
      session => session.id === sessionId && session.userId === userId
    ),
  createChatSession: async (userId: number, title: string, model?: string) => {
    const session: SessionRecord = {
      id: state.nextSessionId++,
      userId,
      title,
      model: model ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    state.sessions.push(session);
    return session;
  },
  getChatMessages: async (userId: number, sessionId: number) => {
    const ownsSession = state.sessions.some(
      session => session.id === sessionId && session.userId === userId
    );
    return ownsSession
      ? state.messages.filter(message => message.sessionId === sessionId)
      : [];
  },
  addChatMessage: async (
    sessionId: number,
    role: "user" | "assistant",
    content: string
  ) => {
    const message: MessageRecord = {
      id: state.nextMessageId++,
      sessionId,
      role,
      content,
      createdAt: new Date(),
    };
    state.messages.push(message);
    return message;
  },
  deleteChatSession: async (userId: number, sessionId: number) => {
    const index = state.sessions.findIndex(
      session => session.id === sessionId && session.userId === userId
    );
    if (index < 0) return false;
    state.sessions.splice(index, 1);
    state.messages = state.messages.filter(
      message => message.sessionId !== sessionId
    );
    return true;
  },
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async () => ({
    choices: [{ message: { content: "Server-side test response" } }],
  })),
  listLLMModels: vi.fn(async () => ({ data: [{ id: "gemini-test" }] })),
}));

import { appRouter } from "./routers";

function contextFor(userId: number): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `user-${userId}`,
      name: `User ${userId}`,
      email: `user-${userId}@example.com`,
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("chat router contracts", () => {
  beforeEach(() => {
    state.sessions = [];
    state.messages = [];
    state.nextSessionId = 1;
    state.nextMessageId = 1;
  });

  it("rejects invalid empty, oversize, invalid-session, and blank-model inputs", async () => {
    const caller = appRouter.createCaller(contextFor(1));
    await expect(caller.chat.complete({ content: "" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
    await expect(
      caller.chat.complete({ content: "x".repeat(8001) })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.chat.complete({ content: "Hi", sessionId: 0 })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.chat.complete({ content: "Hi", model: " " })
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("persists a user request and assistant response in ordered history", async () => {
    const caller = appRouter.createCaller(contextFor(1));
    const result = await caller.chat.complete({
      content: "Explain protected routes",
      model: "gemini-test",
    });

    expect(result.session.title).toBe("Explain protected routes");
    expect(result.session.model).toBe("gemini-test");
    expect(result.userMessage.role).toBe("user");
    expect(result.assistantMessage.content).toBe("Server-side test response");
    await expect(caller.chat.listSessions()).resolves.toHaveLength(1);
    await expect(
      caller.chat.getMessages({ sessionId: result.session.id })
    ).resolves.toMatchObject([
      { role: "user", content: "Explain protected routes" },
      { role: "assistant", content: "Server-side test response" },
    ]);
  });

  it("keeps stored conversations inaccessible to a different authenticated user", async () => {
    const owner = appRouter.createCaller(contextFor(1));
    const outsider = appRouter.createCaller(contextFor(2));
    const result = await owner.chat.complete({ content: "Private note" });

    await expect(
      outsider.chat.getMessages({ sessionId: result.session.id })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      outsider.chat.deleteSession({ sessionId: result.session.id })
    ).resolves.toEqual({ deleted: false });
    await expect(outsider.chat.listSessions()).resolves.toEqual([]);
  });
});
