"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/api/verify";

export default function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState(
    "Verifying email..."
  );

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Missing verification token");
        return;
      }

      try {
        await verifyEmail(token);

        setMessage("Email verified successfully");

        setTimeout(() => {
          router.push("/login");
        }, 1500);

      } catch (err: any) {
        setMessage(
          err?.response?.data?.detail ||
          "Verification failed"
        );
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 halftone opacity-20 pointer-events-none" />

      <div className="panel bg-card rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="font-comic text-3xl mb-4">
          EMAIL VERIFICATION
        </h1>

        <p className="font-bold">
          {message}
        </p>
      </div>
    </div>
  );
}