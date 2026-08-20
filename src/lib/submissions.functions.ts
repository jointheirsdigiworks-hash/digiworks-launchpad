import { createServerFn } from "@tanstack/react-start";
import { contactSchema, quoteSchema, bookingSchema } from "./submission-schemas";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    const { enforceRateLimit } = await import("./rate-limit.server");
    const { notifyAdmin } = await import("./notify.server");
    await enforceRateLimit("enquiry");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("enquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      service: data.service ?? null,
      message: data.message,
    });
    if (error) throw new Error("We could not save your enquiry. Please try again.");
    await notifyAdmin("New website enquiry", [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone ?? "-"}`,
      `Service: ${data.service ?? "-"}`,
      "",
      data.message,
    ]);
    return { ok: true as const };
  });

export const submitQuoteRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => quoteSchema.parse(input))
  .handler(async ({ data }) => {
    const { enforceRateLimit, reference } = await import("./rate-limit.server");
    const { notifyAdmin } = await import("./notify.server");
    await enforceRateLimit("quote");
    const ref = reference("JHQ");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("quote_requests").insert({
      reference: ref,
      service: data.service,
      project_brief: data.projectBrief,
      goals: data.goals ?? null,
      timeline: data.timeline ?? null,
      budget_range: data.budgetRange,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
    });
    if (error) throw new Error("We could not save your quote request. Please try again.");
    await notifyAdmin(`New quote request ${ref}`, [
      `Reference: ${ref}`,
      `Service: ${data.service}`,
      `Budget: ${data.budgetRange}`,
      `Timeline: ${data.timeline ?? "-"}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone ?? "-"}`,
      `Company: ${data.company ?? "-"}`,
      "",
      data.projectBrief,
      "",
      `Goals: ${data.goals ?? "-"}`,
    ]);
    return { ok: true as const, reference: ref };
  });

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { enforceRateLimit, reference } = await import("./rate-limit.server");
    const { notifyAdmin } = await import("./notify.server");
    await enforceRateLimit("booking");
    const ref = reference("JHB");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("bookings").insert({
      reference: ref,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      needs: data.needs,
    });
    if (error) throw new Error("We could not save your booking. Please try again.");
    await notifyAdmin(`New strategy session request ${ref}`, [
      `Reference: ${ref}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone ?? "-"}`,
      `Company: ${data.company ?? "-"}`,
      `Preferred: ${data.preferredDate} at ${data.preferredTime}`,
      "",
      data.needs,
    ]);
    return { ok: true as const, reference: ref };
  });
