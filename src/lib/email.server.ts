/**
 * Visitor-facing transactional email for the digital store.
 *
 * Templates live in `site_settings.email_templates` so the admin can edit the
 * subject and body of both the free-download email and the paid-order email
 * without a code change. Sending uses RESEND_API_KEY when configured and falls
 * back to a server log otherwise, so checkout never fails because of email.
 */

export type EmailTemplates = {
  from_name: string;
  free_subject: string;
  free_body: string;
  paid_subject: string;
  paid_body: string;
};

export const emailTemplateDefaults: EmailTemplates = {
  from_name: "JointHeirs DigiWorks",
  free_subject: "Your download is ready — {{product}}",
  free_body:
    "Hi {{name}},\n\nThank you for choosing JointHeirs DigiWorks Agency.\n\nYour download for {{product}} is ready:\n{{download_url}}\n\nOrder reference: {{reference}}\nThis secure link expires on {{expires}} and allows up to {{limit}} downloads.\n\nIntelligence. Creativity. Growth.\nJointHeirs DigiWorks Agency",
  paid_subject: "Order received — {{product}} ({{reference}})",
  paid_body:
    "Hi {{name}},\n\nWe have received your order for {{product}}.\n\nOrder reference: {{reference}}\nAmount: {{amount}}\n\nOur team will confirm your payment and release your secure download link shortly.\n\nIntelligence. Creativity. Growth.\nJointHeirs DigiWorks Agency",
};

export async function loadEmailTemplates(): Promise<EmailTemplates> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "email_templates")
      .maybeSingle();
    return { ...emailTemplateDefaults, ...((data?.value ?? {}) as Partial<EmailTemplates>) };
  } catch {
    return emailTemplateDefaults;
  }
}

export function renderTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_match, key: string) => vars[key.toLowerCase()] ?? "");
}

export async function sendVisitorEmail(to: string, subject: string, text: string, fromName: string) {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.info(`[email] (not sent — no provider key) to=${to} subject=${subject}`);
    return { sent: false as const };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: `${fromName} <onboarding@resend.dev>`,
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      console.error(`[email] provider responded ${res.status}`);
      return { sent: false as const };
    }
    return { sent: true as const };
  } catch (error) {
    console.error("[email] send failed", error);
    return { sent: false as const };
  }
}

/** Sends the order confirmation / download email for one purchased item. */
export async function sendOrderEmail(input: {
  to: string;
  name: string;
  product: string;
  reference: string;
  amount: string;
  paid: boolean;
  downloadUrl: string;
  expires: string;
  limit: number;
}) {
  const templates = await loadEmailTemplates();
  const vars: Record<string, string> = {
    name: input.name || "there",
    product: input.product,
    reference: input.reference,
    amount: input.amount,
    download_url: input.downloadUrl,
    expires: input.expires,
    limit: String(input.limit),
  };
  const subject = renderTemplate(input.paid ? templates.paid_subject : templates.free_subject, vars);
  const body = renderTemplate(input.paid ? templates.paid_body : templates.free_body, vars);
  return sendVisitorEmail(input.to, subject, body, templates.from_name || emailTemplateDefaults.from_name);
}
