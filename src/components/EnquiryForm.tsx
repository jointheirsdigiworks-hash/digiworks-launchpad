import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(120).optional(),
  message: z.string().trim().min(10, "Tell us a little more").max(1500),
});

type Field = { name: keyof z.infer<typeof schema>; label: string; type?: string; textarea?: boolean; required?: boolean };

const fields: Field[] = [
  { name: "name", label: "Full name", required: true },
  { name: "email", label: "Email address", type: "email", required: true },
  { name: "phone", label: "Phone / WhatsApp" },
  { name: "service", label: "Service of interest" },
  { name: "message", label: "Project details", textarea: true, required: true },
];

export function EnquiryForm({ submitLabel = "Send Enquiry" }: { submitLabel?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = schema.safeParse({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      service: String(form.get("service") ?? ""),
      message: String(form.get("message") ?? ""),
    });

    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please check the highlighted fields.");
      return;
    }

    setErrors({});
    toast.success("Details validated. Enquiry delivery goes live in the next phase.");
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="luxe-card mt-10 max-w-2xl space-y-5 p-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="font-display text-[11px] tracking-[0.2em] uppercase">
            {field.label}
            {field.required && <span className="text-gold"> *</span>}
          </label>
          {field.textarea ? (
            <textarea
              id={field.name}
              name={field.name}
              rows={5}
              maxLength={1500}
              className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              maxLength={255}
              className="mt-2 w-full rounded-md border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-gold"
            />
          )}
          {errors[field.name] && <p className="mt-1.5 text-xs text-destructive">{errors[field.name]}</p>}
        </div>
      ))}
      <button
        type="submit"
        className="rounded-full bg-gold px-7 py-3 font-display text-[12px] tracking-[0.18em] uppercase text-ink transition-transform duration-300 hover:-translate-y-0.5"
      >
        {submitLabel}
      </button>
    </form>
  );
}
