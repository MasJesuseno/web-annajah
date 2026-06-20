import { NextResponse } from "next/server";

// Check if Prisma can be loaded
let prismaAvailable = false;
let prismaError = "";

try {
  require.resolve("@prisma/client");
  prismaAvailable = true;
} catch (e: any) {
  prismaError = "@prisma/client not found: " + e.message;
}

export async function GET() {
  try {
    if (!prismaAvailable) {
      return NextResponse.json({
        status: "error",
        step: "import",
        message: prismaError,
        env: {
          DATABASE_URL: process.env.DATABASE_URL ? "set" : "NOT SET",
          NODE_ENV: process.env.NODE_ENV || "NOT SET",
        },
      });
    }

    // Try to load prisma dynamically
    const { prisma } = await import("@/lib/prisma");

    // Test database connection
    const userCount = await prisma.user.count();
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, isActive: true },
    });

    return NextResponse.json({
      status: "ok",
      database: "connected",
      userCount,
      users,
      env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "set" : "NOT SET",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "NOT SET",
        DATABASE_URL: process.env.DATABASE_URL ? "set" : "NOT SET",
        NODE_ENV: process.env.NODE_ENV || "NOT SET",
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      step: "query",
      message: error?.message || String(error),
      stack: error?.stack || null,
    });
  }
}
