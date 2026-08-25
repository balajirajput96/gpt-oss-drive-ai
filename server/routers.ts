import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  addChatMessage,
  createChatSession,
  deleteChatSession,
  getChatMessages,
  getChatSession,
  listChatSessions,
} from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM, listLLMModels } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { buildLLMMessages, createSessionTitle } from "./chatUtils";
import { getGeminiCatalogueStatus } from "./geminiHealth";

const chatInput = z.object({
  sessionId: z.number().int().positive().optional(),
  content: z.string().trim().min(1).max(8000),
  model: z.string().trim().min(1).max(160).optional(),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  chat: router({
    models: protectedProcedure.query(async () => {
      const catalogue = await listLLMModels();
      return catalogue.data
        .slice(0, 40)
        .map(model => ({ id: model.id, label: model.id }));
    }),
    listSessions: protectedProcedure.query(({ ctx }) =>
      listChatSessions(ctx.user.id)
    ),
    getMessages: protectedProcedure
      .input(z.object({ sessionId: z.number().int().positive() }))
      .query(async ({ ctx, input }) => {
        const session = await getChatSession(ctx.user.id, input.sessionId);
        if (!session)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        return getChatMessages(ctx.user.id, input.sessionId);
      }),
    createSession: protectedProcedure
      .input(
        z.object({
          title: z.string().trim().min(1).max(160),
          model: z.string().trim().max(160).optional(),
        })
      )
      .mutation(({ ctx, input }) =>
        createChatSession(ctx.user.id, input.title, input.model)
      ),
    deleteSession: protectedProcedure
      .input(z.object({ sessionId: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => ({
        deleted: await deleteChatSession(ctx.user.id, input.sessionId),
      })),
    complete: protectedProcedure
      .input(chatInput)
      .mutation(async ({ ctx, input }) => {
        let session = input.sessionId
          ? await getChatSession(ctx.user.id, input.sessionId)
          : undefined;
        if (input.sessionId && !session)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        if (!session)
          session = await createChatSession(
            ctx.user.id,
            createSessionTitle(input.content),
            input.model
          );

        const userMessage = await addChatMessage(
          session.id,
          "user",
          input.content
        );
        const history = await getChatMessages(ctx.user.id, session.id);
        try {
          const completion = await invokeLLM({
            model: input.model || session.model || undefined,
            messages: [
              {
                role: "system",
                content:
                  "You are GPT-OSS Drive AI. Be accurate, concise when appropriate, and format answers in clear Markdown.",
              },
              ...buildLLMMessages(history),
            ],
          });
          const responseContent = completion.choices?.[0]?.message?.content;
          const assistantContent =
            typeof responseContent === "string" && responseContent.trim()
              ? responseContent.trim()
              : "I could not generate a response. Please try again.";
          const assistantMessage = await addChatMessage(
            session.id,
            "assistant",
            assistantContent
          );
          return { session, userMessage, assistantMessage };
        } catch (error) {
          console.error("[chat.complete] LLM request failed", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "The AI service could not respond. Please try again.",
          });
        }
      }),
  }),
  integrations: router({
    geminiStatus: protectedProcedure.query(async () => {
      const status = await getGeminiCatalogueStatus();
      if (!status.configured) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Gemini API is not configured",
        });
      }
      try {
        return {
          connected: status.connected,
          modelCount: status.modelCount,
          provider: status.provider,
        };
      } catch (error) {
        console.error(
          "[integrations.geminiStatus] Gemini health check failed",
          error
        );
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Gemini provider is temporarily unavailable",
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
