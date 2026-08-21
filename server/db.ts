import { and, asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { ChatMessage, ChatSession, InsertUser, chatMessages, chatSessions, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listChatSessions(userId: number): Promise<ChatSession[]> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db.select().from(chatSessions).where(eq(chatSessions.userId, userId)).orderBy(desc(chatSessions.updatedAt));
}

export async function getChatSession(userId: number, sessionId: number): Promise<ChatSession | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const rows = await db
    .select()
    .from(chatSessions)
    .where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)))
    .limit(1);
  return rows[0];
}

export async function createChatSession(userId: number, title: string, model?: string): Promise<ChatSession> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(chatSessions).values({ userId, title, model: model || null });
  const sessionId = Number((result as unknown as Array<{ insertId: number }>)[0]?.insertId);
  const session = await getChatSession(userId, sessionId);
  if (!session) throw new Error("Chat session could not be created");
  return session;
}

export async function getChatMessages(userId: number, sessionId: number): Promise<ChatMessage[]> {
  const session = await getChatSession(userId, sessionId);
  if (!session) return [];
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  return db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(asc(chatMessages.createdAt), asc(chatMessages.id));
}

export async function addChatMessage(sessionId: number, role: "user" | "assistant", content: string): Promise<ChatMessage> {
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  const result = await db.insert(chatMessages).values({ sessionId, role, content });
  const messageId = Number((result as unknown as Array<{ insertId: number }>)[0]?.insertId);
  const rows = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!rows[0]) throw new Error("Chat message could not be created");
  await db.update(chatSessions).set({ updatedAt: new Date() }).where(eq(chatSessions.id, sessionId));
  return rows[0];
}

export async function deleteChatSession(userId: number, sessionId: number): Promise<boolean> {
  const session = await getChatSession(userId, sessionId);
  if (!session) return false;
  const db = await getDb();
  if (!db) throw new Error("Database is unavailable");
  await db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  await db.delete(chatSessions).where(and(eq(chatSessions.id, sessionId), eq(chatSessions.userId, userId)));
  return true;
}
