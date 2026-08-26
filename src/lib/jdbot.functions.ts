import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const askSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(1200),
      }),
    )
    .min(1)
    .max(14),
});

const FALLBACK =
  "I'm not certain about that one. Please reach our team directly — WhatsApp +234 902 776 9832, call 0903 114 7808, or email jointheirsdigiworks@gmail.com and we'll help right away.";

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
