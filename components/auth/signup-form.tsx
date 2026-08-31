/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import Link from "next/link";
import * as Yup from "yup";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

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
import { apiResendOtp, registerAccount, apiVerifyEmail } from "@/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signupSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Full name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  phone: Yup.string()
    .matches(/^[0-9+\-\s()]{8,20}$/, "Invalid phone number")
    .required("Phone number is required"),

  country: Yup.string().required("Country is required"),

  orgName: Yup.string().required("Organization name is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm your password"),
});

function StepIndicator({ current }: { current: number }) {
  const steps = ["Profile", "Security", "Verify"];

  return (
    <div className="w-full flex justify-center">
      <div className="mb-6 flex items-center gap-2 w-full">
        {steps.map((stepLabel, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < current;
          const isCurrent = stepNumber === current;

          return (
            <div
              key={stepLabel}
              className="flex flex-1 last:flex-none items-center gap-2"
            >
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border text-sm font-semibold transition-all",
                  isComplete && "border-primary bg-primary/10 text-primary",
                  isCurrent &&
                    "border-primary bg-primary text-primary-foreground shadow-sm",
                  !isComplete &&
                    !isCurrent &&
                    "border-muted-foreground/20 bg-background text-muted-foreground",
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  stepNumber
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full",
                    isComplete ? "bg-primary/40" : "bg-muted",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Step3 = ({
  email,
  onVerify,
  onBack,
}: {
  email: string;
  onVerify: ({ email, code }: { email: string; code: string }) => Promise<void>;
  onBack: () => void;
}) => {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const refs: React.RefObject<HTMLInputElement>[] | any = Array.from(
    { length: 6 },
    () => React.createRef(),
  );

  React.useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

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

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setCode(next);
    refs[Math.min(pasted.length, 5)].current?.focus();
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
      await onVerify({ email, code: full });
      toast.success("Email verified successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message);
      setCode(["", "", "", "", "", ""]);
      refs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await apiResendOtp({ email });
      setCountdown(60);
      setCode(["", "", "", "", "", ""]);
      setError("");
      toast.success("New code sent to " + email);
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
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
                ${error ? "border-red-500" : "--border-default"}
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

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full disabled:cursor-not-allowed hover:cursor-pointer !disabled:opacity-60 mb-3"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying…
            </>
          ) : (
            <>
              Verify Email <ArrowRight size={16} />
            </>
          )}
        </Button>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="text-sm py-2"
          >
            ← Back
          </Button>
          <Button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="text-sm py-2 font-500 disabled:opacity-50"
          >
            {resending
              ? "Sending…"
              : countdown > 0
                ? `Resend in ${countdown}s`
                : "Resend code"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [step, setStep] = useState(1);
  const [requestError, setRequestError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      country: "",
      orgName: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: signupSchema,

    onSubmit: async (values) => {
      try {
        setRequestError(null);
        formik.setSubmitting(true);
        await registerAccount({
          name: values.name,
          email: values.email,
          password: values.password,
          phone: values.phone,
          country: values.country,
          orgName: values.orgName,
        });
        setStep(3);
      } catch (error: any) {
        console.log(error?.response?.data?.message);
        toast.error(
          error?.response?.data?.message ||
            "We could not verify your code right now.",
        );
      } finally {
        formik.setSubmitting(false);
      }
    },
  });

  const nextStep = async () => {
    const fields =
      step === 1
        ? ["name", "email", "phone", "country", "orgName"]
        : ["password", "confirmPassword"];
    const errors: Record<string, string | undefined> =
      await formik.validateForm();

    fields.forEach((field) => formik.setFieldTouched(field, true));

    if (fields.some((field) => errors[field])) {
      return;
    }

    setStep((current) => current + 1);
  };

  const previousStep = () => {
    setRequestError(null);
    setStep((current) => current - 1);
  };

  const verifyOtp = async (values: { email: string; code: string }) => {
    await apiVerifyEmail(values);
  };

  return (
    <>
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 1 && "Tell us about your team"}
            {step === 2 && "Set a secure password"}
            {step === 3 && "Verify your email"}
          </p>
        </div>

        <StepIndicator current={step} />

        {requestError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30">
            {requestError}
          </div>
        )}
        <form
          onSubmit={formik.handleSubmit}
          className={cn("flex flex-col gap-6", className)}
          {...props}
        >
          {step === 1 && (
            <>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.name && !!formik.errors.name}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.name}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
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

              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+8801XXXXXXXXX"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={formik.touched.phone && !!formik.errors.phone}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.phone}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <Input
                  id="country"
                  name="country"
                  placeholder="Bangladesh"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={
                    formik.touched.country && !!formik.errors.country
                  }
                />
                {formik.touched.country && formik.errors.country && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.country}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="orgName">Organization Name</FieldLabel>
                <Input
                  id="orgName"
                  name="orgName"
                  placeholder="OpenAI"
                  value={formik.values.orgName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={
                    formik.touched.orgName && !!formik.errors.orgName
                  }
                />
                {formik.touched.orgName && formik.errors.orgName && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.orgName}
                  </p>
                )}
              </Field>

              <Button size="lg" type="button" onClick={nextStep}>
                Continue <ArrowRight size={16} />
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
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
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={
                    formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword
                  }
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </Field>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  type="button"
                  variant="outline"
                  onClick={previousStep}
                >
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1"
                  disabled={formik.isSubmitting}
                >
                  Send code <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}
        </form>

        {step === 3 && (
          <Step3
            email={formik.values.email}
            onBack={previousStep}
            onVerify={verifyOtp}
          />
        )}

        <FieldSeparator>Or continue with</FieldSeparator>

        <Field>
          <Button variant="outline" type="button" disabled>
            Sign up with Google
          </Button>

          <FieldDescription className="text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </>
  );
}
