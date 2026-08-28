import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { askJdBot, requestChatHandoff } from "@/lib/jdbot.functions";
import { site, whatsappHref } from "@/lib/site";

type Message = { role: "user" | "assistant"; content: string };

const greeting =
  "Hello! I'm JDBot — how can JointHeirs DigiWorks help you grow today?";

const quickLinks = [
  { label: "Request a Quote", to: "/quote" },
  { label: "Book a Strategy Session", to: "/book" },
  { label: "Explore Services", to: "/services" },
  { label: "View Portfolio", to: "/portfolio" },
  { label: "Visit Shop", to: "/shop" },
  { label: "Contact Us", to: "/contact" },
] as const;

const prompts = [
  "What services do you offer?",
  "How does your process work?",
  "Tell me about your digital products",
  "How do I get pricing?",
] as const;

const channels = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "Email" },
  { value: "call", label: "Phone call" },
] as const;

type Channel = (typeof channels)[number]["value"];

export function JDBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: greeting }]);
  const [sessionKey, setSessionKey] = useState("");
  const [handoff, setHandoff] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", note: "" });
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const ask = useServerFn(askJdBot);
  const submitHandoff = useServerFn(requestChatHandoff);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("jdbot-session");
    const key = stored ?? `jdbot-${crypto.randomUUID()}`;
    if (!stored) window.sessionStorage.setItem("jdbot-session", key);
    setSessionKey(key);
  }, []);

  const mutation = useMutation({
    mutationFn: async (history: Message[]) =>
      ask({ data: { messages: history.slice(-12), ...(sessionKey ? { sessionKey } : {}) } }),
    onSuccess: (result) => setMessages((current) => [...current, { role: "assistant", content: result.reply }]),
    onError: () =>
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Sorry — I couldn't reach our systems. Reach us on WhatsApp ${site.whatsappDisplay}, call ${site.phones[0]}, or email ${site.email}.`,
        },
      ]),
  });

  const handoffMutation = useMutation({
    mutationFn: async () =>
      submitHandoff({
        data: {
          sessionKey,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          channel,
          topic: form.topic.trim(),
          note: form.note.trim(),
          messages: messages.slice(-20),
        },
      }),
    onSuccess: () => {
      toast.success("Thank you — our team has your details.");
      setHandoff(false);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Thanks ${form.name.trim() || "there"} — a JointHeirs specialist will reach you by ${channel}. You can continue the conversation now if you'd like.`,
        },
      ]);
      if (channel === "whatsapp") {
        const text = `Hello JointHeirs DigiWorks, this is ${form.name.trim()}. ${form.topic.trim() || "I'd like to make an enquiry"}. ${form.note.trim()}`;
        window.open(
          `https://wa.me/${site.whatsapp.replace("+", "")}?text=${encodeURIComponent(text)}`,
          "_blank",
          "noreferrer",
        );
      } else if (channel === "email") {
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          form.topic.trim() || "Enquiry from JDBot",
        )}&body=${encodeURIComponent(`${form.note.trim()}\n\n${form.name.trim()} · ${form.phone.trim()}`)}`;
      }
    },
    onError: (error: Error) => toast.error(error.message || "Could not send your details. Please try again."),
  });

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, mutation.isPending, open, handoff]);

  function send(text: string) {
    const trimmed = text.trim().slice(0, 1000);
    if (!trimmed || mutation.isPending) return;
    const history: Message[] = [...messages.filter((m) => m.content !== greeting || m.role === "user"), { role: "user", content: trimmed }];
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setInput("");
    mutation.mutate(history.filter((m) => m.role === "user" || m.content !== greeting));
  }

  const canSubmit = form.name.trim().length >= 2 && /.+@.+\..+/.test(form.email.trim());


  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close JDBot assistant" : "Open JDBot assistant"}
        aria-expanded={open}
        className="animate-gold-pulse fixed right-5 bottom-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold text-ink shadow-[var(--shadow-luxe)] transition-transform duration-300 hover:-translate-y-1"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {open && (
        <section
          aria-label="JDBot assistant"
          className="fixed right-3 bottom-24 z-50 flex max-h-[75vh] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-gold-soft bg-background shadow-[var(--shadow-luxe)]"
        >
          <header className="flex items-center gap-3 border-b border-border bg-surface/70 px-5 py-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-[12px] tracking-[0.18em] uppercase">JDBot</p>
              <p className="text-xs text-muted-foreground">Intelligence. Creativity. Growth.</p>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.map((message, index) => (
              <p
                key={`${index}-${message.content.slice(0, 12)}`}
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-gold text-ink"
                    : "bg-surface text-foreground/90"
                }`}
              >
                {message.content}
              </p>
            ))}
            {mutation.isPending && <p className="text-xs text-muted-foreground">JDBot is typing…</p>}

            {messages.length <= 1 && (
              <div className="pt-2">
                <p className="font-display text-[10px] tracking-[0.24em] text-gold uppercase">Quick links</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-gold-soft px-3 py-1.5 text-xs text-muted-foreground hover:border-gold hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <p className="mt-4 font-display text-[10px] tracking-[0.24em] text-gold uppercase">Ask JDBot</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-gold hover:text-gold"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {handoff ? (
            <form
              className="space-y-3 border-t border-border px-4 py-4"
              onSubmit={(event) => {
                event.preventDefault();
                if (canSubmit && !handoffMutation.isPending) handoffMutation.mutate();
              }}
            >
              <p className="font-display text-[10px] tracking-[0.24em] text-gold uppercase">Talk to a specialist</p>
              <p className="text-[11px] text-muted-foreground">
                Share your details and we'll continue on your preferred channel.
              </p>
              <input
                aria-label="Your name"
                value={form.name}
                maxLength={100}
                required
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Full name"
                className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                aria-label="Your email"
                type="email"
                value={form.email}
                maxLength={255}
                required
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="Email address"
                className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                aria-label="Your phone number"
                value={form.phone}
                maxLength={40}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="Phone / WhatsApp number (optional)"
                className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                aria-label="What do you need help with"
                value={form.topic}
                maxLength={120}
                onChange={(event) => setForm({ ...form, topic: event.target.value })}
                placeholder="What do you need? e.g. website, ads, branding"
                className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <textarea
                aria-label="Extra details"
                value={form.note}
                rows={2}
                maxLength={1200}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                placeholder="Anything else we should know?"
                className="w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <div className="flex flex-wrap gap-2">
                {channels.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setChannel(option.value)}
                    aria-pressed={channel === option.value}
                    className={`rounded-full border px-3 py-1.5 text-xs ${
                      channel === option.value
                        ? "border-gold bg-gold text-ink"
                        : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={!canSubmit || handoffMutation.isPending}
                  className="flex-1 rounded-full bg-gold px-4 py-2 font-display text-[11px] tracking-[0.16em] text-ink uppercase disabled:opacity-60"
                >
                  {handoffMutation.isPending ? "Sending…" : "Connect me"}
                </button>
                <button
                  type="button"
                  onClick={() => setHandoff(false)}
                  className="rounded-full border border-border px-4 py-2 font-display text-[11px] tracking-[0.16em] uppercase"
                >
                  Back
                </button>
              </div>
            </form>
          ) : (
            <>
              <form
                className="flex items-center gap-2 border-t border-border px-4 py-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  send(input);
                }}
              >
                <label htmlFor="jdbot-input" className="sr-only">
                  Message JDBot
                </label>
                <input
                  id="jdbot-input"
                  value={input}
                  maxLength={1000}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about services, process, products…"
                  className="flex-1 rounded-full border border-input bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  aria-label="Send message"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setHandoff(true)}
                  className="rounded-full border border-gold-soft px-3 py-1.5 text-[11px] text-gold uppercase"
                >
                  Talk to a human
                </button>
                <span>
                  or{" "}
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="text-gold">
                    WhatsApp {site.whatsappDisplay}
                  </a>{" "}
                  ·{" "}
                  <a href={`mailto:${site.email}`} className="text-gold">
                    Email us
                  </a>
                </span>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
