/** Best-effort admin email notification. Uses RESEND_API_KEY when configured. */
export async function notifyAdmin(subject: string, lines: string[]) {
  const apiKey = process.env["RESEND_API_KEY"];
  const to = process.env["ADMIN_NOTIFY_EMAIL"] ?? "jointheirsdigiworks@gmail.com";
  const body = lines.join("\n");

  if (!apiKey) {
    console.info(`[notify] ${subject}\n${body}`);
    return { sent: false as const };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: "JointHeirs DigiWorks <onboarding@resend.dev>",
        to: [to],
        subject,
        text: body,
      }),
    });
    if (!res.ok) {
      console.error(`[notify] email provider responded ${res.status}`);
      return { sent: false as const };
    }
    return { sent: true as const };
  } catch (error) {
    console.error("[notify] email failed", error);
    return { sent: false as const };
  }
}
