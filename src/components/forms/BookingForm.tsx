import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/forms/Field";
import { supabase } from "@/integrations/supabase/client";
import { bookingSchema } from "@/lib/submission-schemas";
import { submitBooking } from "@/lib/submissions.functions";

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function BookingForm() {
  const send = useServerFn(submitBooking);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [date, setDate] = useState("");

  const { data: slots } = useQuery({
    queryKey: ["availability"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_slots")
        .select("id, day_of_week, start_time, end_time")
        .eq("active", true)
        .order("day_of_week");
      if (error) throw error;
      return data;
    },
  });

  const selectedDay = date ? new Date(`${date}T00:00:00`).getDay() : null;
  const daySlots = slots?.filter((slot) => slot.day_of_week === selectedDay) ?? [];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const parsed = bookingSchema.safeParse({
      name: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      phone: String(values.get("phone") ?? ""),
      company: String(values.get("company") ?? ""),
      preferredDate: String(values.get("preferredDate") ?? ""),
      preferredTime: String(values.get("preferredTime") ?? ""),
      needs: String(values.get("needs") ?? ""),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const result = await send({ data: parsed.data });
      setReference(result.reference);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (reference) {
    return (
      <div className="luxe-card mt-10 max-w-2xl p-7">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl uppercase">Session requested</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Your reference is{" "}
          <strong className="font-display tracking-[0.16em] text-gold">{reference}</strong>. We will confirm,
          reschedule or follow up by email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="luxe-card mt-10 max-w-2xl space-y-5 p-6">
      <Field id="b-name" label="Full name" required error={errors["name"]}>
        <input id="b-name" name="name" maxLength={100} autoComplete="name" className={inputClass} />
      </Field>
      <Field id="b-email" label="Email address" required error={errors["email"]}>
        <input id="b-email" name="email" type="email" maxLength={255} autoComplete="email" className={inputClass} />
      </Field>
      <Field id="b-phone" label="Phone / WhatsApp" error={errors["phone"]}>
        <input id="b-phone" name="phone" maxLength={40} autoComplete="tel" className={inputClass} />
      </Field>
      <Field id="b-company" label="Company" error={errors["company"]}>
        <input id="b-company" name="company" maxLength={120} className={inputClass} />
      </Field>
      <Field
        id="b-date"
        label="Preferred date"
        required
        error={errors["preferredDate"]}
        hint={
          slots?.length
            ? `Available days: ${[...new Set(slots.map((s) => dayNames[s.day_of_week]))].join(", ")}`
            : undefined
        }
      >
        <input
          id="b-date"
          name="preferredDate"
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field
        id="b-time"
        label="Preferred time slot"
        required
        error={errors["preferredTime"]}
        hint={date && daySlots.length === 0 ? "No slots set for that day — pick another date." : undefined}
      >
        <select id="b-time" name="preferredTime" className={inputClass} defaultValue="">
          <option value="">Select a slot</option>
          {daySlots.map((slot) => (
            <option key={slot.id} value={`${slot.start_time} – ${slot.end_time} WAT`}>
              {slot.start_time} – {slot.end_time} WAT
            </option>
          ))}
        </select>
      </Field>
      <Field id="b-needs" label="What do you need help with?" required error={errors["needs"]}>
        <textarea id="b-needs" name="needs" rows={5} maxLength={2000} className={inputClass} />
      </Field>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gold px-7 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink disabled:opacity-60"
      >
        {loading ? "Sending…" : "Book Session"}
      </button>
    </form>
  );
}
