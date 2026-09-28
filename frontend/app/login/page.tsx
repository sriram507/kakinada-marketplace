"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      const redirectTo = searchParams.get("redirect") || "/";
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border rounded-lg p-6 shadow-sm"
      >
        <h1 className="text-xl font-bold text-gray-900 mb-4">Login</h1>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm rounded px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <label className="block text-sm text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full mb-3"
        />

        <label className="block text-sm text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full mb-4"
        />

        <button
          type="submit"
          disabled={submitting}
          className="bg-gray-900 text-white rounded px-4 py-2 w-full hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-gray-600 mt-4 text-center">
          No account?{" "}
          <Link href="/register" className="text-gray-900 font-medium underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}
