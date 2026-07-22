import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TOPIC_LABELS: Record<string, string> = {
  order: "Order support",
  sizing: "Sizing & fit help",
  partnership: "Brand partnership",
  press: "Press & media",
  other: "Something else",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();
    const topicLabel = TOPIC_LABELS[body.subject || ""] || "General enquiry";

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: "WearLoop Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "himanshu.suthar.dev@gmail.com",
      subject: `[${topicLabel}] New message from ${name}`,
      replyTo: email,
      html: `
        <h2>New WearLoop contact form submission</h2>
        <p><strong>Topic:</strong> ${escapeHtml(topicLabel)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to send your message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to send your message. Please try again." },
      { status: 500 }
    );
  }
}