import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { VotingCredentialsEmail } from "@/components/email/VotingCredentials";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { id, all } = await req.json();

    if (!id && !all) {
      return NextResponse.json({ success: false, message: "Participant ID or 'all' option is required" }, { status: 400 });
    }

    let participants = [];
    if (all) {
      participants = await prisma.user.findMany({
        where: { 
          AND: [
            { email: { not: null } },
            { email: { not: "" } }
          ]
        } as any,
        select: { id: true, nim: true, name: true, email: true, plainPassword: true }
      });
    } else {
      const p = await prisma.user.findUnique({
        where: { id },
        select: { id: true, nim: true, name: true, email: true, plainPassword: true }
      });
      if (p) participants.push(p);
    }

    if (participants.length === 0) {
       return NextResponse.json({ success: false, message: "No participants with valid emails found." }, { status: 404 });
    }

    // Default sender or from env
    const senderEmail = process.env.RESEND_SENDER_EMAIL || "Polytechnic English Conversation Club <pecc@le26.algaray.dev>";
    const loginUrl = process.env.NEXTAUTH_URL || "https://le26.algaray.dev";

    // Resend batch sending
    const emailsPayload = participants.map(participant => ({
      from: senderEmail,
      to: participant.email!,
      subject: "Your Leader Election 2026 Voting Credentials",
      react: React.createElement(VotingCredentialsEmail, {
        name: participant.name || "Participant",
        nim: participant.nim || "N/A",
        password: participant.plainPassword || undefined,
        loginUrl: loginUrl,
      }),
    }));

    // Split payload to chunks of 50 to respect Resend batch limits (max 50-100 per chunk typically)
    const chunkSize = 50;
    const finalData = [];
    for (let i = 0; i < emailsPayload.length; i += chunkSize) {
      const chunk = emailsPayload.slice(i, i + chunkSize);
      const { data, error } = await resend.batch.send(chunk);
      if (error) {
        console.error("Batch send error:", error);
      }
      finalData.push(data);
    }

    return NextResponse.json({ success: true, count: participants.length, data: finalData });
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to send email" }, { status: 500 });
  }
}
