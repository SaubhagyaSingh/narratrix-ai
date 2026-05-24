"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signup } from "@/api/auth";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password needs one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password needs one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password needs one number");
    }

    return errors;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError("Invalid email format");
      setLoading(false);
      return;
    }

    const passwordErrors = validatePassword(password);

    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(", "));
      setLoading(false);
      return;
    }

    try {
      await signup({
        email: normalizedEmail,
        password,
      });

      router.push("/login");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail.map((e: any) => e.msg).join(", "));
      } else {
        setError(detail || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 halftone opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 inline-block speech-bubble bg-card px-5 py-3 font-comic text-2xl">
          Ready to save the day?
        </div>

        <div className="panel bg-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary panel flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>

            <h1 className="font-comic text-4xl">
              SIGN UP
            </h1>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">

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
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff /> : <Eye />}
                </button>
              }
            />

            {error && (
              <div className="panel bg-secondary px-4 py-2 font-bold">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full panel bg-accent py-3 font-comic text-xl"
            >
              {loading ? "CREATING..." : "CREATE ⚡"}
            </button>

          </form>

          <p className="mt-6 text-center font-bold">
            Already a hero?{" "}
            <Link
              href="/login"
              className="underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  trailing
}: any) {
  return (
    <label>
      <span className="font-comic">
        {label}
      </span>

      <div className="flex items-center gap-2 panel px-3 py-2">
        {icon}

        <input
          type={type}
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="flex-1 bg-transparent outline-none"
        />

        {trailing}
      </div>
    </label>
  );
}