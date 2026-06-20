import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API is working!",
    env: {
      NODE_ENV: process.env.NODE_ENV || "not set",
    },
  });
}
