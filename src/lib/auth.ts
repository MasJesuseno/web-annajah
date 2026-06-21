import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { validateCaptcha } from "./math-captcha";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "Captcha Token", type: "hidden" },
        captchaAnswer: { label: "Captcha Answer", type: "hidden" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Validate math captcha
          const captchaToken = credentials.captchaToken as string;
          const captchaAnswer = credentials.captchaAnswer as string;
          if (!captchaToken || !captchaAnswer) {
            throw new Error("CaptchaError");
          }
          if (!validateCaptcha(captchaToken, captchaAnswer)) {
            throw new Error("CaptchaError");
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
            include: { roles: { include: { role: true } } },
          });

          if (!user || !user.isActive) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            image: user.image,
            roles: user.roles.map((ur) => ur.role.name),
          };
        } catch (error) {
          console.error("Auth error:", error);
          // Re-throw CaptchaError so the frontend can catch it
          if (error instanceof Error && error.message === "CaptchaError") {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as any).roles || [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).roles = token.roles || [];
      }
      return session;
    },
  },
});
