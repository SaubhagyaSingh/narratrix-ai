"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/api/auth";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("test123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signup({ email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="panel p-8 w-[350px]">
        <h1 className="font-comic text-3xl mb-4">SIGN UP</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            placeholder="Email"
            className="w-full border p-2"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            value={password}
            className="w-full border p-2"
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500">{error}</p>}

          <button className="w-full bg-accent py-2 font-comic">
            {loading ? "CREATING..." : "CREATE ⚡"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Already a hero? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}