import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCaptcha } from "@/lib/math-captcha";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, captchaToken, captchaAnswer } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Validate math captcha
    if (!captchaToken || !captchaAnswer) {
      return NextResponse.json(
        { error: "Harap isi verifikasi keamanan", captchaError: true },
        { status: 400 }
      );
    }
    if (!validateCaptcha(captchaToken, captchaAnswer)) {
      return NextResponse.json(
        { error: "Jawaban keamanan salah. Silakan coba lagi.", captchaError: true },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: { name, email, phone, subject, message },
    });

    return NextResponse.json(
      { message: "Pesan berhasil dikirim", data: contact },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
