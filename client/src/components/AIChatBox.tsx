import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Loader2, Send, Sparkles, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

export type Message =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string };

type AIChatBoxProps = {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  input?: string;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  emptyStateMessage?: string;
  height?: string | number;
  suggestedPrompts?: string[];
};

export function AIChatBox({
  messages,
  onSendMessage,
  isLoading = false,
  input,
  onInputChange,
  placeholder = "Message GPT-OSS Drive AI…",
  emptyStateMessage = "Start with a question, a document, or a code snippet.",
  height,
  suggestedPrompts,
}: AIChatBoxProps) {
  const [uncontrolledInput, setUncontrolledInput] = useState("");
  const [hasFocused, setHasFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentInput = input ?? uncontrolledInput;
  const updateInput = onInputChange ?? setUncontrolledInput;
  const displayMessages = messages.filter(
    (message): message is Exclude<Message, { role: "system" }> => message.role !== "system",
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isLoading]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const content = currentInput.trim();
    if (!content || isLoading) return;
    onSendMessage(content);
    updateInput("");
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-white/8 bg-[#0c1526]/88 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl" style={height ? { height } : undefined}>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-6 sm:px-8 sm:pt-8">
        {displayMessages.length === 0 ? (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center animate-fade-up">
            <div className="mb-6 grid size-16 place-items-center rounded-2xl border border-cyan-200/15 bg-cyan-300/8 shadow-[0_0_40px_rgba(34,211,238,0.13)]">
              <Sparkles className="size-7 text-cyan-200" />
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">What would you like to create?</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">{emptyStateMessage}</p>
            <div className="mt-7 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {["Analyze an idea", "Improve a draft", "Plan a project"].map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/7 bg-white/[0.025] px-4 py-3 text-left text-sm text-slate-300 animate-fade-up" style={{ animationDelay: `${index * 65}ms` }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-7">
            {displayMessages.map((message, index) => (
              <article key={`${message.role}-${index}-${message.content.slice(0, 16)}`} className={cn("flex gap-3 animate-fade-up", message.role === "user" ? "justify-end" : "justify-start")} style={{ animationDelay: `${Math.min(index, 4) * 35}ms` }}>
                {message.role === "assistant" && (
                  <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl border border-cyan-200/15 bg-cyan-300/8">
                    <Sparkles className="size-4 text-cyan-200" />
                  </div>
                )}
                <div className={cn("max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-6 shadow-sm sm:max-w-[78%]", message.role === "user" ? "rounded-tr-md bg-gradient-to-br from-cyan-300 to-sky-400 text-slate-950" : "rounded-tl-md border border-white/7 bg-white/[0.045] text-slate-100")}>
                  {message.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-6 prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/25">
                      <Streamdown>{message.content}</Streamdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.07]">
                    <UserRound className="size-4 text-slate-200" />
                  </div>
                )}
              </article>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3 animate-fade-up">
                <div className="grid size-8 place-items-center rounded-xl border border-cyan-200/15 bg-cyan-300/8"><Sparkles className="size-4 text-cyan-200" /></div>
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-white/7 bg-white/[0.045] px-4 py-3 text-sm text-slate-400">
                  <Loader2 className="size-4 animate-spin text-cyan-200" /> Thinking through it…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="border-t border-white/7 bg-[#0a1221]/80 p-3 sm:p-5">
        <form onSubmit={submit} className={cn("mx-auto flex max-w-4xl items-end gap-3 rounded-2xl border bg-white/[0.035] p-2.5 transition-all duration-200", hasFocused ? "border-cyan-200/35 shadow-[0_0_0_4px_rgba(34,211,238,0.06)]" : "border-white/9")}>
          <Textarea
            ref={textareaRef}
            value={currentInput}
            onChange={event => updateInput(event.target.value)}
            onFocus={() => setHasFocused(true)}
            onBlur={() => setHasFocused(false)}
            onKeyDown={event => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit(event);
              }
            }}
            rows={1}
            placeholder={placeholder}
            className="min-h-12 max-h-36 resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-100 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
          />
          <Button type="submit" disabled={!currentInput.trim() || isLoading} size="icon" className="size-10 shrink-0 rounded-xl bg-cyan-300 text-slate-950 shadow-[0_8px_28px_rgba(34,211,238,0.25)] transition-transform duration-150 hover:bg-cyan-200 active:scale-95 disabled:bg-slate-700 disabled:text-slate-400">
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </form>
        {suggestedPrompts?.length ? <div className="mx-auto mt-2 flex max-w-4xl flex-wrap gap-2 px-2">{suggestedPrompts.map(prompt => <button key={prompt} onClick={() => updateInput(prompt)} className="rounded-lg border border-white/8 px-2.5 py-1 text-xs text-slate-400 hover:border-cyan-200/25 hover:text-cyan-100">{prompt}</button>)}</div> : null}
        <p className="mx-auto mt-2 max-w-4xl px-2 text-center text-[11px] text-slate-500">Server-side AI gateway · Markdown ready · Your API keys never reach the browser</p>
      </div>
    </section>
  );
}
