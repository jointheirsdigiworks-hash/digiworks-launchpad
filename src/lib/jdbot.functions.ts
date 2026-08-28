import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(1200),
});

const askSchema = z.object({
  messages: z.array(messageSchema).min(1).max(14),
  sessionKey: z.string().trim().min(8).max(60).optional(),
});

const handoffSchema = z.object({
  sessionKey: z.string().trim().min(8).max(60),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  channel: z.enum(["whatsapp", "email", "call"]),
  topic: z.string().trim().max(120).optional().or(z.literal("")),
  note: z.string().trim().max(1200).optional().or(z.literal("")),
  messages: z.array(messageSchema).max(30).optional(),
});

const FALLBACK =
  "I'm not certain about that one. Please reach our team directly — WhatsApp +234 902 776 9832, call 0903 114 7808, or email jointheirsdigiworks@gmail.com and we'll help right away.";

/** Records the running transcript of a JDBot conversation for admin review. */
async function saveTranscript(sessionKey: string, messages: { role: string; content: string }[]) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip =
      getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    await supabaseAdmin.from("chat_sessions").upsert(
      {
        session_key: sessionKey,
        transcript: messages.slice(-40),
        message_count: messages.length,
        ip_address: ip,
      },
      { onConflict: "session_key" },
    );
  } catch (error) {
    console.error("[jdbot] transcript log failed", error);
  }
}

/** JDBot — answers visitor questions about services, process, products and contact. */
export const askJdBot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => askSchema.parse(input))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("./rate-limit.server");
    try {
      await enforceRateLimit("jdbot", 40, 15);
    } catch {
      return { reply: "You've sent a lot of messages just now. Please pause a moment and try again." };
    }

    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { reply: FALLBACK };

    const { publicDb } = await import("./public-db.server");
    const db = publicDb();
    const [services, products] = await Promise.all([
      db.from("services").select("name, short_description, category").eq("active", true).order("sort_order"),
      db.from("products").select("title, short_description, category, price, currency").eq("published", true).limit(20),
    ]);

    const system = [
      "You are JDBot, the assistant for JointHeirs DigiWorks Agency — an AI powered digital growth agency based at 76 Lola Holloway Street, Omole Phase 1, Ikeja, Lagos, Nigeria.",
      "Brand message: Intelligence. Creativity. Growth. Founder/CEO: Ulrich Archie-Bong.",
      "Contact: WhatsApp +234 902 776 9832, phones 0903 114 7808 and 0805 440 0328, email jointheirsdigiworks@gmail.com.",
      "Answer in at most 90 words, warm and premium in tone, never using emoji spam.",
      "NEVER invent prices, statistics, awards, timelines, client names or team biographies. If asked for pricing, say quotes are prepared per project and point to the free quote form at /quote.",
      "Useful links: /services, /portfolio, /insights, /shop, /quote, /book, /contact.",
      `Services offered: ${(services.data ?? []).map((s) => `${s.name} (${s.category ?? "general"}): ${s.short_description}`).join(" | ")}`,
      `Digital products currently listed: ${(products.data ?? []).map((p) => `${p.title} — ${p.category}`).join(" | ") || "none published yet"}`,
      `If you cannot answer confidently, reply exactly: ${FALLBACK}`,
    ].join("\n");

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3.7-flash",
          messages: [{ role: "system", content: system }, ...data.messages],
        }),
      });
      if (!response.ok) {
        console.error(`[jdbot] gateway responded ${response.status}`);
        return { reply: FALLBACK };
      }
      const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const reply = payload.choices?.[0]?.message?.content?.trim();
      return { reply: reply && reply.length > 0 ? reply : FALLBACK };
    } catch (error) {
      console.error("[jdbot] request failed", error);
      return { reply: FALLBACK };
    }
  });
