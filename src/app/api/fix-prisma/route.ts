import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const cwd = process.cwd();
    const result = execSync("npx prisma generate", {
      cwd,
      encoding: "utf-8",
      timeout: 30000,
    });

    return NextResponse.json({
      status: "ok",
      message: "Prisma generate berhasil",
      output: result,
      cwd,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error?.message || String(error),
      stdout: error?.stdout || "",
      stderr: error?.stderr || "",
    });
  }
}
