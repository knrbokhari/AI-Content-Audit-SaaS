/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PencilSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FieldGroup } from "@/components/ui/field";
import {
  apiForgotPassword,
  apiResendOtp,
  apiResetPassword,
  apiVerifyOtp,
} from "@/services/api";

const ForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [time, setTime] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const recaptchaRef: React.RefObject<any> = useRef(null);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(12, "Password must be at least 12 characters long.")
      .test("password-complexity", "", function (value) {
        if (value && value.length < 16) {
          // Validate each condition individually and return the appropriate error message
          if (!/[A-Z]/.test(value)) {
            return this.createError({
              path: this.path,
              message: "Password must include at least one uppercase letter.",
            });
          }
          if (!/[a-z]/.test(value)) {
            return this.createError({
              path: this.path,
              message: "Password must include at least one lowercase letter.",
            });
          }
          if (!/\d/.test(value)) {
            return this.createError({
              path: this.path,
              message: "Password must include at least one digit.",
            });
          }
          if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
            return this.createError({
              path: this.path,
              message: "Password must include at least one special character.",
            });
          }
        }
        return true;
      })
      .required("Password is required"),
    re_password: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Please confirm your password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | undefined;
    if (step === 1 && time > 0) {
      setIsTimerRunning(true);
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (time === 0) {
      setIsTimerRunning(false);
      // setResendBtn(true);
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [time, step]);

  const onSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiForgotPassword({
        email,
        recaptchaToken,
      });
      setStep(1);
      setTime(120);
      toast.success(res.message);
      setIsLoading(false);
      // Reset token and CAPTCHA if needed after success
      setRecaptchaToken("");
      setCaptchaVerified(false);
      recaptchaRef.current?.reset(); // reset after success
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);

      // Reset reCAPTCHA on failure
      setRecaptchaToken("");
      setCaptchaVerified(false);
      recaptchaRef.current?.reset();
    }
  };

  const onSubmitOtp = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    setIsLoading(true);
    try {
      const res = await apiVerifyOtp({
        email,
        code: otp,
      });

      setStep(2);
      toast.success(res.message);
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (value: { password: string }) => {
    setIsLoading(true);

    try {
      const res = await apiResetPassword({
        email,
        code: otp,
        password: value.password,
        recaptchaToken,
      });
      toast.success(res.message);
      router.push("/login");

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const resentOpt = async () => {
    try {
      const res = await apiResendOtp({ email });
      setStep(1);
      setTime(120);
      toast.success(res.message);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const onCaptchaChange = (value: string | null) => {
    if (value) {
      setRecaptchaToken(value);
      setCaptchaVerified(true); // CAPTCHA is successfully verified
    } else {
      setCaptchaVerified(false); // CAPTCHA failed
    }
  };

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
          <div className="w-full max-w-md border p-10 rounded-3xl bg-[#F5F9FF] ">
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email address below and we&apos;ll get you back on
                  track.
                </p>

                {step === 0 && (
                  <div className="w-full">
                    <div className="rounded-lg relative mt-3 before:top-3 before:scale-x-95 before:content-[''] before:absolute before:left-0 before:right-0 before:w-full before:h-full before:bg-[#ffffff33] before:rounded-md before:z-[-1]  after:top-6 after:scale-x-90 after:content-[''] after:absolute after:left-0 after:right-0 after:w-full after:h-full after:bg-[#ffffff33] after:rounded-md after:z-[-1]">
                      <form action="#" onSubmit={onSubmitEmail}>
                        <div className="mb-6">
                          <label className="text-uppercase block text-base font-medium mb-2 text-left">
                            Email Address:
                          </label>
                          <input
                            id="email"
                            type="email"
                            className="border-[#ececec] mt-1 w-full py-3 px-5 text-base rounded-md text-black font-normal border"
                            placeholder="Enter your email address"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div
                          style={{
                            transform: "scale(0.7)",
                            transformOrigin: "0 0",
                          }}
                        >
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={
                              process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA ?? ""
                            }
                            onChange={onCaptchaChange}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            className="btn bg-(--color-primary) text-white px-8 py-3 font-semibold rounded-md hover:translate-y-[-3px] duration-300 disabled:bg-slate-400"
                            type="submit"
                            disabled={isLoading || !captchaVerified}
                          >
                            Sent
                          </button>

                          <p className="text-gray-400">
                            Back to{" "}
                            <span>
                              <Link
                                href="/login"
                                className="text-[#264eee] font-semibold"
                              >
                                Log in
                              </Link>
                            </span>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="w-full">
                    <div className="rounded-lg relative mt-3 before:top-3 before:scale-x-95 before:content-[''] before:absolute before:left-0 before:right-0 before:w-full before:h-full before:bg-[#ffffff33] before:rounded-md before:z-[-1]  after:top-6 after:scale-x-90 after:content-[''] after:absolute after:left-0 after:right-0 after:w-full after:h-full after:bg-[#ffffff33] after:rounded-md after:z-[-1]">
                      <form action="#" onSubmit={onSubmitOtp}>
                        <div className="mb-6">
                          <label className="text-uppercase text-base font-medium mb-2 block text-left">
                            Enter OTP:
                          </label>
                          <input
                            id="otp"
                            name="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            autoComplete="otp"
                            required
                            className="border-[#ececec] mt-1 w-full py-3 px-5 text-base rounded-md text-black font-normal border"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <button
                              className="btn bg-(--color-primary) text-white px-8 py-3 font-semibold rounded-md hover:translate-y-[-3px] duration-300 disabled:bg-slate-400"
                              type="submit"
                              disabled={isLoading || !isTimerRunning}
                            >
                              Verify
                            </button>
                            <button
                              className="btn bg-(--color-primary) text-white px-8 py-3 font-semibold rounded-md hover:translate-y-[-3px] duration-300 disabled:bg-slate-400"
                              type="button"
                              disabled={isTimerRunning || isLoading}
                              onClick={() => resentOpt()}
                            >
                              {isTimerRunning ? time : "Resent"}
                            </button>
                          </div>

                          
                        </div> 
                        <p className="text-gray-400 mt-5">
                            Back to{" "}
                            <span>
                              <Link
                                href="/login"
                                className="text-[#264eee] font-semibold"
                              >
                                Log in
                              </Link>
                            </span>
                          </p>
                      </form>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="w-full">
                    <div className="rounded-lg relative mt-3 before:top-3 before:scale-x-95 before:content-[''] before:absolute before:left-0 before:right-0 before:w-full before:h-full before:bg-[#ffffff33] before:rounded-md before:z-[-1]  after:top-6 after:scale-x-90 after:content-[''] after:absolute after:left-0 after:right-0 after:w-full after:h-full after:bg-[#ffffff33] after:rounded-md after:z-[-1]">
                      <form onSubmit={handleSubmit(onSubmitPassword)}>
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <label
                              htmlFor="password"
                              className="text-uppercase text-base font-medium"
                            >
                              Password:
                            </label>
                          </div>
                          <input
                            // name="password"
                            type="password"
                            className="border-[#ececec] mt-1 w-full py-3 px-5 text-base rounded-md text-black font-normal border"
                            placeholder="Enter your password"
                            {...register("password")}
                          />
                          {errors.password && (
                            <div className="text-red-500 mt-2">
                              {errors.password.message}
                            </div>
                          )}
                        </div>

                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-2">
                            <label
                              htmlFor="password"
                              className="text-uppercase text-base font-medium"
                            >
                              Re-type Password:
                            </label>
                          </div>
                          <input
                            // name="password"
                            type="password"
                            className="border-[#ececec] mt-1 w-full py-3 px-5 text-base rounded-md text-black font-normal border"
                            placeholder="Enter your password"
                            {...register("re_password")}
                          />
                          {errors.re_password && (
                            <div className="text-red-500 mt-2">
                              {errors.re_password.message}
                            </div>
                          )}
                        </div>

                        <div
                          style={{
                            transform: "scale(0.7)",
                            transformOrigin: "0 0",
                          }}
                        >
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={
                              process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA ?? ""
                            }
                            onChange={onCaptchaChange}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <button
                            className="btn bg-(--color-primary) text-white px-8 py-3 font-semibold rounded-md hover:-translate-y-0.75 duration-300 disabled:bg-slate-400"
                            type="submit"
                            disabled={isLoading || !captchaVerified}
                          >
                            Submit
                          </button>

                          <p className="text-gray-400">
                            Back to{" "}
                            <span>
                              <Link
                                href="/login"
                                className="text-[#264eee] font-semibold"
                              >
                                Log in
                              </Link>
                            </span>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </FieldGroup>
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
};

export default ForgotPassword;
