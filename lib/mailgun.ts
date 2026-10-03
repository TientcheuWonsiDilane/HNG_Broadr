export type SendMailgunEmailInput = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  fromName?: string;
};

export function getMailgunConfig() {
  const sandboxDomain =
    process.env.MAILGUN_SANDBOX_DOMAIN ||
    "sandbox78ea0f0ec027483fa2ade7d3ac9a33cd.mailgun.org";

  return {
    apiKey: process.env.MAILGUN_API_KEY || "",
    baseUrl: process.env.MAILGUN_BASE_URL || "https://api.mailgun.net",
    domain: sandboxDomain,
    fromEmail: process.env.MAILGUN_FROM_EMAIL || `postmaster@${sandboxDomain}`,
    fromName: process.env.MAILGUN_FROM_NAME || "Broadr",
  };
}

export async function sendMailgunEmail({
  to,
  subject,
  text,
  html,
  fromName,
}: SendMailgunEmailInput) {
  const {
    apiKey,
    baseUrl,
    domain,
    fromEmail,
    fromName: defaultFromName,
  } = getMailgunConfig();

  if (!apiKey || !domain) {
    throw new Error("Mailgun is not configured.");
  }

  const recipients = Array.isArray(to) ? to.join(",") : to;
  const from = `${fromName || defaultFromName} <${fromEmail}>`;

  const form = new URLSearchParams({
    from,
    to: recipients,
    subject,
    text,
  });

  if (html) {
    form.append("html", html);
  }

  const response = await fetch(`${baseUrl}/v3/${domain}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  const payload = await response.text();

  if (!response.ok) {
    throw new Error(
      `Mailgun request failed (${response.status}): ${payload || "Unknown error"}`,
    );
  }

  return {
    ok: true,
    status: response.status,
    response: payload,
  };
}
