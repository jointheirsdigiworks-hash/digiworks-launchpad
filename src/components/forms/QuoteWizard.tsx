import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/forms/Field";
import { supabase } from "@/integrations/supabase/client";
import { budgetRanges, quoteSchema, timelines, type QuoteInput } from "@/lib/submission-schemas";
import { submitQuoteRequest } from "@/lib/submissions.functions";

const steps = ["Service", "Project details", "Budget", "Your details"] as const;

const empty: QuoteInput = {
  service: "",
  projectBrief: "",
  goals: "",
  timeline: "",
  budgetRange: "",
  name: "",
  email: "",
  phone: "",
  company: "",
};

export function QuoteWizard({ presetService }: { presetService?: string }) {
  const send = useServerFn(submitQuoteRequest);
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<QuoteInput>({ ...empty, service: presetService ?? "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const { data: services } = useQuery({
    queryKey: ["services", "names"],
    queryFn: async () => {
      const { data, error: dbError } = await supabase
        .from("services")
        .select("slug, name")
        .eq("active", true)
        .order("sort_order");
      if (dbError) throw dbError;
      return data;
    },
  });

  function set<K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep(index: number): string | null {
    if (index === 0 && values.service.trim().length < 2) return "Please choose a service.";
    if (index === 1 && values.projectBrief.trim().length < 20)
      return "Please describe the project in a little more detail.";
    if (index === 2 && values.budgetRange.trim().length < 2) return "Please choose a budget range.";
    return null;
  }

  function next() {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = quoteSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please review your details.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await send({ data: parsed.data });
      setReference(result.reference);
    } catch (submitError) {
      toast.error(submitError instanceof Error ? submitError.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (reference) {
    return (
      <div className="luxe-card mt-10 max-w-2xl p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink">
          <Check className="h-6 w-6" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl uppercase">Quote request received</h2>
        <p className="mt-4 text-sm text-muted-foreground">
          Your reference number is{" "}
          <strong className="font-display tracking-[0.16em] text-gold">{reference}</strong>. Please quote it in
          any follow-up. Our team will respond with a clear scope and price.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="luxe-card mt-10 max-w-2xl p-8">
      <ol className="flex flex-wrap gap-3" aria-label="Quote request progress">
        {steps.map((label, index) => (
          <li
            key={label}
            aria-current={index === step ? "step" : undefined}
            className={`font-display text-[10px] tracking-[0.18em] uppercase ${
              index === step ? "text-gold" : index < step ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      <div className="gold-rule mt-5" />

      <div className="mt-7 space-y-5">
        {step === 0 && (
          <Field id="q-service" label="Which service do you need?" required>
            <select
              id="q-service"
              value={values.service}
              onChange={(e) => set("service", e.target.value)}
              className={inputClass}
            >
              <option value="">Select a service</option>
              {services?.map((service) => (
                <option key={service.slug} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </Field>
        )}

        {step === 1 && (
          <>
            <Field id="q-brief" label="Brief project description" required>
              <textarea
                id="q-brief"
                rows={5}
                maxLength={2000}
                value={values.projectBrief}
                onChange={(e) => set("projectBrief", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="q-goals" label="Goals / success measures">
              <textarea
                id="q-goals"
                rows={3}
                maxLength={1000}
                value={values.goals ?? ""}
                onChange={(e) => set("goals", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="q-timeline" label="Timeline">
              <select
                id="q-timeline"
                value={values.timeline ?? ""}
                onChange={(e) => set("timeline", e.target.value)}
                className={inputClass}
              >
                <option value="">Select a timeline</option>
                {timelines.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {step === 2 && (
          <Field id="q-budget" label="Budget range" required>
            <select
              id="q-budget"
              value={values.budgetRange}
              onChange={(e) => set("budgetRange", e.target.value)}
              className={inputClass}
            >
              <option value="">Select a budget range</option>
              {budgetRanges.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        )}

        {step === 3 && (
          <>
            <Field id="q-name" label="Full name" required>
              <input
                id="q-name"
                maxLength={100}
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="q-email" label="Email address" required>
              <input
                id="q-email"
                type="email"
                maxLength={255}
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="q-phone" label="Phone / WhatsApp">
              <input
                id="q-phone"
                maxLength={40}
                value={values.phone ?? ""}
                onChange={(e) => set("phone", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="q-company" label="Company">
              <input
                id="q-company"
                maxLength={120}
                value={values.company ?? ""}
                onChange={(e) => set("company", e.target.value)}
                className={inputClass}
              />
            </Field>
          </>
        )}

        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full border border-gold-soft px-6 py-3 font-display text-[12px] tracking-[0.18em] uppercase"
          >
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-gold px-7 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink"
          >
            Continue
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-gold px-7 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink disabled:opacity-60"
          >
            {loading ? "Sending…" : "Submit Request"}
          </button>
        )}
      </div>
    </form>
  );
}
