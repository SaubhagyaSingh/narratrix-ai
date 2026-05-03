"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/api/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("test123");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login({ email, password });

      // ✅ store token in cookie (for middleware)
      document.cookie = `token=${res.access_token}; path=/; max-age=86400`;

      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 halftone opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 inline-block speech-bubble bg-card px-5 py-3 font-comic text-2xl">
          Welcome back, hero!
        </div>

        <div className="panel bg-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary panel flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="font-comic text-4xl">LOGIN</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Field
              icon={<Mail />}
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
            />

            <Field
              icon={<Lock />}
              label="Password"
              type={showPwd ? "text" : "password"}
              value={password}
              onChange={setPassword}
              trailing={
                <button type="button" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {error && (
              <div className="panel bg-secondary px-4 py-2 font-bold">
                {error}
              </div>
            )}

            <button className="w-full panel bg-primary py-3 font-comic text-xl">
              {loading ? "LOGGING..." : "LOGIN ⚡"}
            </button>
          </form>

          <p className="mt-6 text-center font-bold">
            New here?{" "}
            <Link href="/signup" className="underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, type, value, onChange, trailing }: any) {
  return (
    <label>
      <span className="font-comic">{label}</span>
      <div className="flex items-center gap-2 panel px-3 py-2">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
        {trailing}
      </div>
    </label>
  );
}