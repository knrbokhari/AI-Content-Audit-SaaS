/* eslint-disable @next/next/no-img-element */
"use client"

import { SignupForm } from "@/components/auth/signup-form"
import { PencilSparkles } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col gap-4 bg-background p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/login" className="flex items-center gap-2 font-medium">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
              <PencilSparkles size={16} />
            </div>
            <div>
              <p className="text-sm font-800 leading-tight text-primary">ContentPilot AI</p>
            </div>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-background/90 p-8 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur md:p-10">
            <SignupForm />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://createthemovement.com/wp-content/uploads/2024/07/Keyword-Research-The-Cornerstone-of-SEO-Success.jpg"
          alt="ContentPilot onboarding illustration"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
      </div>
    </div>
  )
}
