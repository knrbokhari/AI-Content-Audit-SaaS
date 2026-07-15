/* eslint-disable @next/next/no-img-element */
"use client";

import { LoginForm } from "@/components/auth/login-form";
import { PencilSparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#4D8EF7" }}
            >
              <PencilSparkles size={16} className="text-white" />
            </div>
            <div>
              <p
                className="font-800 text-sm leading-tight"
                style={{ color: "var(--primary)" }}
              >
                ContentPilot AI
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md border p-10 rounded-3xl">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://createthemovement.com/wp-content/uploads/2024/07/Keyword-Research-The-Cornerstone-of-SEO-Success.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
