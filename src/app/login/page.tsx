"use client";

import { useState } from "react";
import { MathCaptcha } from "@/components/math-captcha";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const captchaToken = formData.get("captchaToken") as string;
    const captchaAnswer = formData.get("captchaAnswer") as string;

    if (!captchaToken || !captchaAnswer) {
      setError("Harap isi verifikasi keamanan");
      setLoading(false);
      return;
    }

    try {
      // Fetch CSRF token first
      const csrfRes = await fetch("/api/auth/csrf");
      if (!csrfRes.ok) throw new Error("CSRF fetch failed");
      const { csrfToken } = await csrfRes.json();

      // POST via form-encoded
      const body = new URLSearchParams();
      body.set("csrfToken", csrfToken);
      body.set("email", email);
      body.set("password", password);
      body.set("captchaToken", captchaToken);
      body.set("captchaAnswer", captchaAnswer);
      body.set("callbackUrl", "/admin/dashboard");

      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        body,
        // Follow redirect, then check final URL
        redirect: "follow",
      });

      // After following redirect, res.url is the final URL
      if (res.url.includes("/admin/dashboard")) {
        window.location.href = "/admin/dashboard";
      } else if (res.url.includes("CaptchaError")) {
        setError("Jawaban keamanan salah. Silakan coba lagi.");
        setCaptchaError((prev) => !prev);
      } else {
        setError("Email atau password salah");
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-100 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary-100 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                placeholder="Masukkan password"
              />
            </div>

            {/* Math Captcha */}
            <MathCaptcha key={String(captchaError)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-primary-900"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                      <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-primary-300 text-sm">
          &copy; {new Date().getFullYear()} SMA Annajah. All rights reserved.
        </p>
      </div>
    </div>
  );
}
