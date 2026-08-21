import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/lib/trpc";
import { startLogin } from "@/const";
import { cn } from "@/lib/utils";
import { BookOpen, Bot, ChevronDown, CircleHelp, Code2, FileText, Globe2, LogOut, Menu, MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Plus, Settings2, Sparkles, Trash2, WandSparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const presets = [
  { label: "Explain this code", prompt: "Explain the following code clearly, including what it does, key logic, and improvements:\n\n", icon: Code2 },
  { label: "Summarize", prompt: "Summarize the following text into clear key points:\n\n", icon: FileText },
  { label: "Translate to Hindi", prompt: "Translate the following text to Hindi while preserving the intended meaning and tone:\n\n", icon: Globe2 },
];

const driveLinks = [
  { label: "Open Colab notebook", href: "https://colab.research.google.com/drive/1ByXAhpvnNcKvmjC-RiFIZACkul4wY_Uc", icon: Bot },
  { label: "Read setup guide", href: "https://drive.google.com/file/d/1WlHhmSeu0e5aG3ixu41eqUo-lEG8Av8U/view?usp=drivesdk", icon: BookOpen },
];

function compactTitle(title: string) {
  return title.length > 28 ? `${title.slice(0, 27)}…` : title;
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [model, setModel] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"chat" | "settings">("chat");
  const [pendingMessage, setPendingMessage] = useState<Message | null>(null);
  const utils = trpc.useUtils();
  const sessionsQuery = trpc.chat.listSessions.useQuery(undefined, { enabled: isAuthenticated });
  const modelsQuery = trpc.chat.models.useQuery(undefined, { enabled: isAuthenticated, retry: 1 });
  const geminiStatusQuery = trpc.integrations.geminiStatus.useQuery(undefined, { enabled: isAuthenticated, staleTime: 60_000, retry: 1 });
  const messagesQuery = trpc.chat.getMessages.useQuery({ sessionId: selectedSessionId ?? 1 }, { enabled: isAuthenticated && selectedSessionId !== null });
  const completeMutation = trpc.chat.complete.useMutation({
    onSuccess: async result => {
      setSelectedSessionId(result.session.id);
      setPendingMessage(null);
      await Promise.all([
        utils.chat.listSessions.invalidate(),
        utils.chat.getMessages.invalidate({ sessionId: result.session.id }),
      ]);
    },
    onError: error => {
      setPendingMessage(null);
      toast.error(error.message || "AI response could not be generated.");
    },
  });
  const deleteMutation = trpc.chat.deleteSession.useMutation({
    onSuccess: async result => {
      if (result.deleted) {
        setSelectedSessionId(null);
        await utils.chat.listSessions.invalidate();
      }
    },
  });

  const models = modelsQuery.data ?? [];
  const selectedModelLabel = model || "Gateway default";
  const messages = useMemo(() => {
    const persisted = (messagesQuery.data ?? []).map(message => ({ role: message.role, content: message.content })) as Message[];
    return pendingMessage ? [...persisted, pendingMessage] : persisted;
  }, [messagesQuery.data, pendingMessage]);

  const startNewChat = () => {
    setSelectedSessionId(null);
    setDraft("");
    setActiveSection("chat");
    setMobileMenuOpen(false);
  };

  const sendMessage = (content: string) => {
    setPendingMessage({ role: "user", content });
    completeMutation.mutate({ sessionId: selectedSessionId ?? undefined, content, model: model || undefined });
  };

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-[#07101d]"><div className="w-full max-w-md space-y-4"><Skeleton className="h-10 w-40 bg-white/8" /><Skeleton className="h-72 w-full rounded-3xl bg-white/8" /></div></div>;
  }

  if (!user || !isAuthenticated) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#07101d] px-5 text-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,.13),transparent_32%),radial-gradient(circle_at_82%_88%,rgba(99,102,241,.13),transparent_30%)]" />
        <section className="relative w-full max-w-lg rounded-[32px] border border-white/10 bg-[#0d1729]/85 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-11 animate-fade-up">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10"><Sparkles className="size-7 text-cyan-200" /></div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">Private workspace</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Your AI, thoughtfully organized.</h1>
          <p className="mt-4 leading-7 text-slate-400">Sign in to use protected conversations, persistent history, model selection, and your GPT-OSS Drive resources.</p>
          <Button onClick={() => startLogin()} className="mt-8 h-12 w-full rounded-xl bg-cyan-300 font-semibold text-slate-950 hover:bg-cyan-200 active:scale-[.98]">Sign in with Manus</Button>
        </section>
      </main>
    );
  }

  const SidebarContent = () => (
    <aside className="flex h-full min-h-0 w-[292px] shrink-0 flex-col border-r border-white/7 bg-[#091321]/95 px-3 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between px-2">
        <button onClick={startNewChat} className="flex items-center gap-2 text-left" aria-label="Start a new conversation">
          <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-200 to-sky-400 shadow-[0_8px_24px_rgba(34,211,238,.25)]"><Sparkles className="size-4 text-slate-950" /></div>
          <div><p className="font-semibold tracking-[-0.03em] text-white">GPT-OSS Drive</p><p className="text-[11px] text-slate-500">AI workspace</p></div>
        </button>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="hidden size-8 rounded-lg text-slate-400 hover:bg-white/6 hover:text-white lg:inline-flex"><PanelLeftClose className="size-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="size-8 rounded-lg text-slate-400 hover:bg-white/6 hover:text-white lg:hidden"><X className="size-4" /></Button>
      </div>

      <Button onClick={startNewChat} className="mt-6 h-11 w-full justify-start gap-2 rounded-xl border border-cyan-200/15 bg-cyan-300/10 px-3 text-cyan-100 hover:bg-cyan-300/16 active:scale-[.98]"><Plus className="size-4" /> New conversation</Button>

      <div className="mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
        <section>
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Conversations</p>
          <div className="mt-2 space-y-1">
            {sessionsQuery.isLoading ? [1, 2, 3].map(item => <Skeleton key={item} className="h-9 w-full bg-white/6" />) : sessionsQuery.data?.length ? sessionsQuery.data.map(session => (
              <div key={session.id} className={cn("group flex items-center gap-1 rounded-xl transition-colors", selectedSessionId === session.id ? "bg-white/[0.08]" : "hover:bg-white/[0.045]")}>
                <button onClick={() => { setSelectedSessionId(session.id); setActiveSection("chat"); setMobileMenuOpen(false); }} className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left text-sm text-slate-300">
                  <Bot className="size-3.5 shrink-0 text-slate-500" /><span className="truncate">{compactTitle(session.title)}</span>
                </button>
                <button onClick={() => deleteMutation.mutate({ sessionId: session.id })} className="mr-1 hidden size-7 place-items-center rounded-lg text-slate-500 hover:bg-red-400/10 hover:text-red-300 group-hover:grid" aria-label={`Delete ${session.title}`}><Trash2 className="size-3.5" /></button>
              </div>
            )) : <p className="px-3 py-3 text-xs leading-5 text-slate-500">Your completed conversations will appear here.</p>}
          </div>
        </section>

        <section className="mt-7">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Prompt presets</p>
          <div className="mt-2 space-y-1">
            {presets.map(({ label, prompt, icon: Icon }) => <button key={label} onClick={() => { setDraft(prompt); setActiveSection("chat"); setMobileMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-white/[0.045] hover:text-slate-100"><Icon className="size-3.5 text-cyan-200/70" />{label}</button>)}
          </div>
        </section>

        <section className="mt-7">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
          <div className="mt-2 space-y-1">
            <button onClick={() => { setActiveSection("settings"); setMobileMenuOpen(false); }} className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors", activeSection === "settings" ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100")}><Settings2 className="size-3.5 text-slate-500" />Settings</button>
            {driveLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/[0.045] hover:text-slate-100"><Icon className="size-3.5 text-slate-500" />{label}</a>)}
          </div>
        </section>
      </div>

      <div className="mt-4 border-t border-white/7 pt-3">
        <div className="flex items-center gap-2 rounded-xl px-2 py-2">
          <Avatar className="size-8 border border-white/10"><AvatarFallback className="bg-white/8 text-xs text-cyan-100">{user.name?.slice(0, 1).toUpperCase() || "U"}</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-slate-200">{user.name || "Authenticated user"}</p><p className="truncate text-[11px] text-slate-500">{user.role === "admin" ? "Owner account" : user.email || "Manus OAuth"}</p></div>
          <button onClick={logout} className="grid size-8 place-items-center rounded-lg text-slate-500 transition-colors hover:bg-red-400/10 hover:text-red-300" aria-label="Sign out"><LogOut className="size-3.5" /></button>
        </div>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-[#07101d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -left-40 -top-56 size-[520px] rounded-full bg-cyan-400/8 blur-3xl" /><div className="absolute -bottom-48 right-0 size-[440px] rounded-full bg-indigo-500/10 blur-3xl" /></div>
      <div className="relative flex min-h-screen">
        <div className={cn("hidden transition-[width] duration-200 lg:block", sidebarOpen ? "w-[292px]" : "w-0 overflow-hidden")}><SidebarContent /></div>
        {mobileMenuOpen && <div className="fixed inset-0 z-50 bg-[#020713]/70 backdrop-blur-sm lg:hidden"><div className="h-full animate-slide-in"><SidebarContent /></div></div>}

        <section className="flex min-w-0 flex-1 flex-col p-3 sm:p-5 lg:p-6">
          <header className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="size-10 rounded-xl border border-white/8 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] lg:hidden"><Menu className="size-4" /></Button>
              {!sidebarOpen && <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="hidden size-10 rounded-xl border border-white/8 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08] lg:inline-flex"><PanelLeftOpen className="size-4" /></Button>}
              <div><p className="text-xs font-medium uppercase tracking-[0.16em] text-cyan-200/80">{activeSection === "settings" ? "Settings" : "Secure conversation"}</p><h1 className="mt-0.5 text-lg font-semibold tracking-[-0.03em] text-white">{activeSection === "settings" ? "Workspace preferences" : selectedSessionId ? "Conversation" : "New conversation"}</h1></div>
            </div>
            <div className="relative">
              <select value={model} onChange={event => setModel(event.target.value)} className="h-10 max-w-[190px] appearance-none rounded-xl border border-white/9 bg-[#0d1728] px-3 pr-8 text-xs text-slate-200 outline-none transition-colors hover:border-white/20 focus:border-cyan-200/45">
                <option value="">Gateway default</option>
                {models.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-3 size-3.5 text-slate-500" />
            </div>
          </header>

          {activeSection === "settings" ? (
            <section className="mx-auto grid w-full max-w-3xl gap-4 animate-fade-up">
              <div className="rounded-[28px] border border-white/8 bg-[#0c1526]/88 p-7 shadow-[0_24px_80px_rgba(0,0,0,.25)]"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-cyan-300/10"><Settings2 className="size-5 text-cyan-200" /></div><div><h2 className="font-semibold text-white">Private AI workspace</h2><p className="text-sm text-slate-500">Secure defaults are active for this account.</p></div></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/7 bg-white/[0.025] p-4"><p className="text-xs text-slate-500">Inference</p><p className="mt-1 text-sm font-medium text-slate-100">Server-side gateway</p></div><div className="rounded-2xl border border-white/7 bg-white/[0.025] p-4"><p className="text-xs text-slate-500">Selected model</p><p className="mt-1 truncate text-sm font-medium text-slate-100">{selectedModelLabel}</p></div><div className="rounded-2xl border border-white/7 bg-white/[0.025] p-4"><p className="text-xs text-slate-500">Gemini direct API</p><p className={cn("mt-1 text-sm font-medium", geminiStatusQuery.data?.connected ? "text-emerald-300" : "text-slate-300")}>{geminiStatusQuery.data?.connected ? `Verified · ${geminiStatusQuery.data.modelCount} models available` : geminiStatusQuery.isLoading ? "Checking secure connection…" : "Status unavailable"}</p></div><div className="rounded-2xl border border-white/7 bg-white/[0.025] p-4"><p className="text-xs text-slate-500">Owner access</p><p className="mt-1 text-sm font-medium text-cyan-100">{user.role === "admin" ? "Owner account verified" : "Standard account"}</p></div></div></div>
              <button onClick={() => setActiveSection("chat")} className="text-left text-sm text-cyan-200 hover:text-cyan-100">← Return to conversation</button>
            </section>
          ) : (
            <AIChatBox messages={messages} input={draft} onInputChange={setDraft} onSendMessage={sendMessage} isLoading={completeMutation.isPending} />
          )}
          <footer className="flex items-center justify-center gap-2 py-3 text-[11px] text-slate-600"><CircleHelp className="size-3" /> AI can make mistakes. Verify important outputs.</footer>
        </section>
      </div>
    </main>
  );
}
