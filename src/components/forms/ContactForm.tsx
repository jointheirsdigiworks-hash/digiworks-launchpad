import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Field, SubmitButton, inputClass, zodErrors } from "@/components/forms/Field";
import { supabase } from "@/integrations/supabase/client";
import { contactSchema } from "@/lib/submission-schemas";
import { submitEnquiry } from "@/lib/submissions.functions";

export function ContactForm({ submitLabel = "Send Enquiry" }: { submitLabel?: string }) {
  const send = useServerFn(submitEnquiry);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { data: services } = useQuery({
    queryKey: ["services", "names"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("slug, name")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const parsed = contactSchema.safeParse({
      name: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      phone: String(values.get("phone") ?? ""),
      service: String(values.get("service") ?? ""),
      message: String(values.get("message") ?? ""),
    });
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error.issues));
      toast.error("Please check the highlighted fields.");
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await send({ data: parsed.data });
      form.reset();
      setDone(true);
      toast.success("Thank you. Your enquiry has been received.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="luxe-card mt-10 max-w-2xl p-10">
        <p className="font-display text-[11px] tracking-[0.28em] text-gold uppercase">Received</p>
        <h2 className="mt-4 text-2xl uppercase">Thank you</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Your enquiry is with our team and we will respond shortly.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-8 rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="luxe-card mt-10 max-w-2xl space-y-5 p-8">
      <Field id="name" label="Full name" required error={errors["name"]}>
        <input id="name" name="name" maxLength={100} autoComplete="name" className={inputClass} />
      </Field>
      <Field id="email" label="Email address" required error={errors["email"]}>
        <input id="email" name="email" type="email" maxLength={255} autoComplete="email" className={inputClass} />
      </Field>
      <Field id="phone" label="Phone / WhatsApp" error={errors["phone"]}>
        <input id="phone" name="phone" maxLength={40} autoComplete="tel" className={inputClass} />
      </Field>
      <Field id="service" label="Service needed" error={errors["service"]}>
        <select id="service" name="service" className={inputClass} defaultValue="">
          <option value="">Select a service</option>
          {services?.map((service) => (
            <option key={service.slug} value={service.name}>
              {service.name}
            </option>
          ))}
        </select>
      </Field>
      <Field id="message" label="Message" required error={errors["message"]}>
        <textarea id="message" name="message" rows={5} maxLength={2000} className={inputClass} />
      </Field>
      <SubmitButton loading={loading}>{submitLabel}</SubmitButton>
    </form>
  );
}
