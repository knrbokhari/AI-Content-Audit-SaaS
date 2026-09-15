/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiLogin, apiVerify2FA } from "@/services/api";
import QRCode from "qrcode";
import { toast } from "sonner";
import React, { useState } from "react";
import { ArrowRight, CopyIcon, Smartphone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { permissionsAtom } from "@/atoms/permissionAtom";

const TwoFAStep = ({
  onBack,
  authData,
}: {
  onBack: () => void;
  authData: any;
}) => {
  const router = useRouter();
  const [permissions, setPermissions] = useAtom(permissionsAtom);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);
  const refs: any = Array.from({ length: 6 }, () => React.createRef());

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (
    i: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[i] && i > 0)
      refs[i - 1].current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const full = code.join("");
    if (full.length !== 6) {
      setError("Enter all 6 digits.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await apiVerify2FA({
        code: full,
        tempToken: authData?.tempToken,
      });
      toast.success("Welcome back!");
      localStorage.setItem("auth_token", res?.token);
      setPermissions(res?.permissions || []);
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
      setCode(["", "", "", "", "", ""]);
      refs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {})
      .catch((err) => {});
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-plex-blue-50 dark:bg-plex-blue-900/30 flex items-center justify-center">
          <Smartphone size={24} className="text-plex-blue-500" />
        </div>
      </div>
      <h2
        className="text-2xl font-700 text-center mb-1"
        style={{ color: "var(--text-primary)" }}
      >
        Authenticator Code
      </h2>
      <p
        className="text-sm text-center mb-1"
        style={{ color: "var(--text-secondary)" }}
      >
        Open your authenticator app and enter the 6-digit code
      </p>
      {authData?.secret && (
        <div>
          <div className="text-center mb-6">
            <Image
              src={authData?.data_url}
              alt="QR Code"
              className="mx-auto mb-4 shadow-lg rounded-lg"
            />
          </div>

          <div className="text-center mb-6 mt-2">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span id="secretKey" className="text-gray-700 mr-4 select-all">
                {authData?.secret}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(authData?.secret)}
                className="text-[#264eee] hover:text-[#264eee]-dark transition-colors"
              >
                <CopyIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <p className="text-center text-gray-700 mb-4">
            Scan this QR code or copy the key with your Google Authenticator
            app, and enter the code below:
          </p>

          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              How to set up Two-Factor Authentication (2FA)
            </h3>

            <ol className="text-sm text-gray-700 space-y-3 list-decimal list-inside">
              <li>
                Download Google Authenticator on your phone.{" "}
                <Link
                  href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Android
                </Link>{" "}
                or{" "}
                <Link
                  href="https://apps.apple.com/app/google-authenticator/id388497605"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  iOS
                </Link>
              </li>

              <li>
                Open the app and tap <strong>+</strong> to add a new account.
              </li>

              <li>
                Scan the QR code below <strong>or</strong> manually enter the
                secret key.
              </li>

              <li>
                Enter the 6-digit code generated by the app and click{" "}
                <strong>Verify</strong>.
              </li>
            </ol>
          </div>
        </div>
      )}
      <p
        className="text-xs text-center mb-8"
        style={{ color: "var(--text-tertiary)" }}
      >
        Google Authenticator · Authy · 1Password
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 justify-center mb-6">
          {code.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-13 text-center text-lg font-700 rounded-lg border transition-all outline-none
                ${error ? "border-red-500" : "border-(--border-default)"}
                focus:border-plex-blue-500 focus:shadow-focus`}
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                height: "52px",
              }}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mb-4">{error}</p>
        )}

        <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="accent-plex-blue-500 w-4 h-4"
          />
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Remember this device
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg text-sm font-600 text-white transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60"
          style={{ background: loading ? "#3A72D4" : "#4D8EF7" }}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Verify Code <ArrowRight size={16} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="w-full mt-3 py-2.5 text-sm font-500 rounded-lg transition-all"
          style={{ color: "var(--text-secondary)" }}
        >
          ← Back to login
        </button>
      </form>
    </div>
  );
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [userType, setUserType] = useState("admin");
  const [permissions, setPermissions] = useAtom(permissionsAtom);

  const router = useRouter();
  const [step, setStep] = useState("login"); // 'login' | '2fa'
  const [authedData, setAuthedData] = useState({});

  const formik = useFormik({
    initialValues: {
      email: "superadmin@admin.com",
      password: "12345678",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),

    onSubmit: async (values) => {
      try {
        const res = await apiLogin(values);
        if (res?.requires2FA) {
          QRCode.toDataURL(res?.otpauth_url, (err, data_url) => {
            setAuthedData({
              ...res,
              data_url,
            });
          });
          setStep("2fa");
        } else {
          // 2FA disabled — already logged in by AuthContext, navigate directly
          toast.success("Welcome back!");
          localStorage.setItem("auth_token", res?.token);
          setPermissions(res?.permissions || []);
          router.push("/");
        }
      } catch (error) {
        toast.error("Invalid credentials");
      }
    },
  });

  return (
    <>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
          <div className="w-full mt-4">
            <p className="mb-2 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
              Demo account
            </p>
            <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/70 p-1">
              <Button
                type="button"
                variant={userType === "admin" ? "default" : "outline"}
                size="sm"
                className={cn("flex-1 rounded-md border-0 shadow-none")}
                onClick={() => {
                  setUserType("admin");
                  formik.handleChange("email")("superadmin@admin.com");
                }}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant={userType === "user" ? "default" : "outline"}
                size="sm"
                className={cn("flex-1 rounded-md border-0 shadow-none")}
                onClick={() => {
                  setUserType("user");
                  formik.handleChange("email")("ogadmin@og.com");
                }}
              >
                User
              </Button>
            </div>
          </div>
        </div>
        {step === "login" ? (
          <form
            onSubmit={formik.handleSubmit}
            className={cn("flex flex-col gap-6", className)}
            {...props}
          >
            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                className="bg-background"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={formik.touched.email && !!formik.errors.email}
              />

              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.email}
                </p>
              )}
            </Field>

            {/* Password */}
            <Field>
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <Link
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                className="bg-background"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={
                  formik.touched.password && !!formik.errors.password
                }
              />

              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.password}
                </p>
              )}
            </Field>

            <Field>
              <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </Field>
          </form>
        ) : (
          <>
            <TwoFAStep authData={authedData} onBack={() => setStep("login")} />
          </>
        )}

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" disabled>
            Login with Google
          </Button>

          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </>
  );
}
