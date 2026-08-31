/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { userAtom } from "@/atoms/userAtom";
import {
  createSubscriptionSession,
  getPlans,
  getStripePublishableKey,
} from "@/services/api";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ── Fonts ───────────────────────────────────────────────────────────
// Serif display for the ledger-book headline, monospace for anything
// that reads like a figure on an audit sheet, Inter for running copy.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

// ── Types ───────────────────────────────────────────────────────────
type Plan = {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  intervalCount: number;
  active: boolean;
  productActive: boolean;
  features: string[];
  trialDays: number;
  metadata?: Record<string, string>;
  subscriberCount: number;
};

function formatPrice(cents: number, currency: string) {
  // Prices in the sample payload are already whole units (20 => $20),
  // so we format directly rather than dividing by 100.
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return formatter.format(cents);
}

// ── Page ────────────────────────────────────────────────────────────
export default function ChoosePlanPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getPlans();
      setPlans(data);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const singlePlan = plans.length === 1;

  return (
    <main
      className={`${fraunces.variable} ${plexMono.variable} ${inter.variable} min-h-screen bg-[#10141a] font-[family-name:var(--font-body)] text-[#ECEAE3] antialiased`}
    >
      {/* faint ledger-grid backdrop */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#ECEAE3 1px, transparent 1px), linear-gradient(90deg, #ECEAE3 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-10">
        {/* header */}
        <header className="mx-auto mb-16 max-w-xl text-center sm:mb-20">
          <h1 className="mt-4 font-(family-name:--font-display) text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-[#F5F3EC] sm:text-[3.25rem]">
            Choose the plan that keeps your audits honest.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#9AA0AA]">
            Every plan books cleanly on the same ledger — pick a line, start
            your trial, and we&rsquo;ll square the rest.
          </p>
        </header>

        {/* plan grid */}
        <div
          className={`mx-auto grid gap-8 ${
            singlePlan
              ? "max-w-md grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={i}
              selectPlan={setSelectedPlan}
            />
          ))}
        </div>

        <p className="mx-auto mt-14 max-w-md text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#5C6470]">
          Prices in USD · Cancel anytime · No hidden line items
        </p>
      </div>

      <ConfirmModal
        plan={selectedPlan}
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </main>
  );
}

// ── Plan card ───────────────────────────────────────────────────────
function PlanCard({
  plan,
  index,
  selectPlan,
}: {
  plan: Plan;
  index: number;
  selectPlan: any;
}) {
  const disabled = !plan.active || !plan.productActive;
  const rotation = index % 2 === 0 ? "-rotate-2" : "rotate-2";

  return (
    <div className="relative">
      {/* stamp — sits half off the card corner, like an auditor's approval mark */}
      {plan.trialDays > 0 && (
        <div
          className={`absolute -right-3 -top-4 z-10 flex h-16 w-16 ${rotation} select-none items-center justify-center rounded-full border-2 border-primary bg-primary`}
          aria-hidden="true"
        >
          <span className="text-center font-mono text-[9px] font-semibold uppercase leading-tight tracking-[0.08em] text-white">
            {plan.trialDays}
            <br />
            Day
            <br />
            Trial
          </span>
        </div>
      )}

      <div className="flex h-full flex-col rounded-sm border border-[#D8D0BC] bg-[#F3EFE4] p-8 text-primary shadow-[0_1px_0_0_#00000022,0_20px_40px_-24px_#000000aa]">
        {/* ledger header row */}
        <div className="flex items-baseline justify-between border-b border-dashed border-[#C9C1A9] pb-4">
          <h2 className="font-(family-name:--font-display) text-[1.4rem] font-semibold leading-tight">
            {plan.name}
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8368]">
            No. {plan.productId.slice(-6)}
          </span>
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed text-[#4A4A42]">
          {plan.description}
        </p>

        {/* price */}
        <div className="mt-6 flex items-end gap-1.5">
          <span className="font-mono text-[2.75rem] font-semibold leading-none tracking-tight">
            {formatPrice(plan.price, plan.currency)}
          </span>
          <span className="pb-1 font-mono text-[13px] text-[#8A8368]">
            /{plan.intervalCount > 1 ? `${plan.intervalCount} ` : ""}
            {plan.interval}
          </span>
        </div>

        {/* feature ledger lines */}
        <ul className="mt-7 flex-1 space-y-3">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-baseline gap-2 text-[13.5px]"
            >
              <span className="font-mono text-primary">✓</span>
              <span className="flex-1 border-b border-dotted border-[#C9C1A9] pb-1">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => selectPlan(plan)}
          className="mt-8 w-full rounded-sm bg-primary py-3 font-mono text-[12.5px] font-medium uppercase tracking-[0.12em] text-[#F3EFE4] transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {/* {disabled
            ? "Unavailable"
            : plan.trialDays > 0
              ? `Start ${plan.trialDays}-day trial`
              : "Choose plan"} */}
          Choose plan
        </button>

        {/* {plan.trialDays > 0 && (
          <p className="mt-3 text-center font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.1em] text-[#8A8368]">
            No charge for {plan.trialDays} days
          </p>
        )} */}
      </div>
    </div>
  );
}

const ConfirmModal = ({
  plan,
  open,
  onClose,
}: {
  plan: any;
  open: boolean;
  onClose: any;
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!plan) return;
    setLoading(true);
    try {
      const keyRes = await getStripePublishableKey();

      const publishableKey =
        typeof keyRes === "string" ? keyRes : keyRes?.publishableKey;

      if (!publishableKey) {
        toast.error("Stripe is unavailable right now.");
        return;
      }

      const stripe = await loadStripe(keyRes);

      if (!stripe) {
        toast.error("Stripe is unavailable right now. Please try again later.");
        return;
      }

      const data = await createSubscriptionSession({
        priceId: plan.id,
        paymentMethodId: "",
        couponId: "",
      });

      if (!data?.url) {
        toast.error("Unable to start checkout. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Subscription</DialogTitle>
          <DialogDescription>
            <div className="pt-4 pb-2">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-primary-tint)] mb-4">
                  <Zap className="h-7 w-7 text-(--color-primary)" />
                </div>
                <h2 className="text-xl font-bold dark:text-white mb-2">
                  {plan?.name}
                </h2>
                <p className="text-(--color-tertiary) dark:text-gray-400">
                  You&apos;re subscribing for{" "}
                  <span className="text-(--color-primary) font-semibold">
                    ${plan?.price}/{plan?.interval}
                  </span>
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-[#222425] rounded-xl p-4 mb-6">
                <p className="text-sm text-(--color-tertiary) dark:text-gray-400 leading-relaxed">
                  You will be charged automatically every {plan?.interval}. You
                  can cancel anytime from your account settings.
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!block">
          <div className="flex gap-3">
            <Button onClick={onClose} className="flex-1" variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Redirecting..." : "Continue to Payment"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
