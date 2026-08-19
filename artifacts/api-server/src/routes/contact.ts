import { ReplitConnectors } from "@replit/connectors-sdk";
import { SubmitContactMessageBody } from "@workspace/api-zod";
import { Router } from "express";

const contactRouter = Router();
const recipient = "info@nextsphere.it";
const maxRequestsPerWindow = 5;
const rateLimitWindowMs = 15 * 60 * 1000;
const maxTrackedIps = 10_000;
const requestsByIp = new Map<string, { requests: number[]; lastSeen: number }>();

function makeRoomForRateLimit(now: number): void {
  if (requestsByIp.size < maxTrackedIps) return;

  for (const [ip, entry] of requestsByIp) {
    if (now - entry.lastSeen >= rateLimitWindowMs) {
      requestsByIp.delete(ip);
    }
  }

  while (requestsByIp.size >= maxTrackedIps) {
    const oldestIp = requestsByIp.keys().next().value;
    if (!oldestIp) return;
    requestsByIp.delete(oldestIp);
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestsByIp.get(ip);
  const recentRequests = (entry?.requests ?? []).filter(
    (timestamp) => now - timestamp < rateLimitWindowMs,
  );

  if (recentRequests.length >= maxRequestsPerWindow) {
    requestsByIp.set(ip, { requests: recentRequests, lastSeen: now });
    return true;
  }

  recentRequests.push(now);
  if (!entry) makeRoomForRateLimit(now);
  requestsByIp.set(ip, { requests: recentRequests, lastSeen: now });
  return false;
}

function toSingleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!,
  );
}

contactRouter.post("/contact", async (req, res) => {
  const parsed = SubmitContactMessageBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Please check the information you entered." });
    return;
  }

  const contact = {
    name: toSingleLine(parsed.data.name),
    email: parsed.data.email.trim().toLowerCase(),
    phone: parsed.data.phone.trim(),
    message: parsed.data.message.trim(),
  };

  if (
    contact.name.length < 2 ||
    contact.email.length === 0 ||
    contact.phone.length < 6 ||
    contact.message.length < 10 ||
    !/^[0-9+().\s-]+$/.test(contact.phone)
  ) {
    res.status(400).json({ error: "Please check the information you entered." });
    return;
  }

  if (isRateLimited(req.ip ?? "unknown")) {
    res.status(429).json({ error: "Too many requests. Please try again in a few minutes." });
    return;
  }

  const from = process.env["CONTACT_FROM_EMAIL"];
  if (!from) {
    req.log.error("Contact email sender is not configured");
    res.status(503).json({ error: "The contact service is temporarily unavailable. Please try again later." });
    return;
  }

  const escaped = {
    name: escapeHtml(contact.name),
    email: escapeHtml(contact.email),
    phone: escapeHtml(contact.phone),
    message: escapeHtml(contact.message).replace(/\n/g, "<br />"),
  };

  try {
    const connectors = new ReplitConnectors();
    const response = await connectors.proxy("resend", "/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: contact.email,
        subject: `Nuova richiesta NextSphere — ${contact.name}`,
        html: `
          <h1>Nuova richiesta dal sito NextSphere</h1>
          <p><strong>Nome:</strong> ${escaped.name}</p>
          <p><strong>Email:</strong> ${escaped.email}</p>
          <p><strong>Telefono:</strong> ${escaped.phone}</p>
          <p><strong>Messaggio:</strong><br />${escaped.message}</p>
        `,
      }),
    });

    if (!response.ok) {
      req.log.error({ statusCode: response.status }, "Resend rejected contact email");
      res.status(503).json({ error: "The contact service is temporarily unavailable. Please try again later." });
      return;
    }

    req.log.info("Contact email accepted by Resend");
    res.json({ ok: true });
  } catch (error) {
    req.log.error({ error }, "Failed to send contact email");
    res.status(503).json({ error: "The contact service is temporarily unavailable. Please try again later." });
  }
});

export default contactRouter;