export type StoredChatRole = "user" | "assistant";

export function createSessionTitle(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) return "New conversation";
  return normalized.length > 64 ? `${normalized.slice(0, 63).trimEnd()}…` : normalized;
}

export function isSessionOwnedBy(sessionUserId: number, requestingUserId: number): boolean {
  return sessionUserId === requestingUserId;
}

export function buildLLMMessages(messages: Array<{ role: StoredChatRole; content: string }>) {
  return messages.map(message => ({ role: message.role, content: message.content }));
}
