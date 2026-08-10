/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  createSettingsPaymentGateway,
  getSettingsPaymentGateway,
  updateSettingPaymentGateway,
} from "@/services/api";

const CURRENCIES = ["USD", "EUR", "GBP", "AED", "INR", "SGD", "AUD", "CAD"];

const schema = yup.object({
  stripePublishableKey: yup
    .string()
    .trim()
    .required("Publishable key is required"),
  stripeSecretKey: yup.string().trim().required("Secret key is required"),
  stripeMode: yup
    .string()
    .oneOf(["test", "live"], "Invalid Stripe mode")
    .required("Stripe mode is required"),
  stripeWebhookSecret: yup
    .string()
    .trim()
    .required("Webhook secret is required"),
  currency: yup
    .string()
    .oneOf(CURRENCIES, "Invalid currency")
    .required("Currency is required"),
  paymentSuccessUrl: yup
    .string()
    .url("Please enter a valid URL")
    .required("Payment success URL is required"),
  paymentCancelUrl: yup
    .string()
    .url("Please enter a valid URL")
    .required("Payment cancel URL is required"),
});

type RoleConfigFormValues = yup.InferType<typeof schema>;

interface RoleConfigProps {
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<RoleConfigFormValues>;
  isEdit?: boolean;
  onSubmit?: (data: RoleConfigFormValues) => void | Promise<void>;
}

const defaultValues: RoleConfigFormValues = {
  stripePublishableKey: "",
  stripeSecretKey: "",
  stripeMode: "test",
  stripeWebhookSecret: "",
  currency: "USD",
  paymentSuccessUrl: "",
  paymentCancelUrl: "",
};

const RoleConfig = ({ open, onClose, isEdit = false }: RoleConfigProps) => {
  const [data, setData] = useState<any>(defaultValues);

  const fetchConfiguration = async () => {
    try {
      const res = await getSettingsPaymentGateway();
      if (res?.id) setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (open) fetchConfiguration();
  }, [open]);

  const [showKeys, setShowKeys] = useState({
    publishable: true,
    secret: false,
    webhook: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RoleConfigFormValues>({
    defaultValues: data,
    resolver: yupResolver(schema),
  });

  const stripeMode = watch("stripeMode");

  useEffect(() => {
    if (open) {
      reset({
        ...data,
      });
    }
  }, [open, data, reset]);

  const toggleKey = (key: keyof typeof showKeys) => {
    setShowKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFormSubmit = async (inputs: RoleConfigFormValues) => {
    try {
      if (!data?.id) {
        await createSettingsPaymentGateway(inputs);
      } else {
        await updateSettingPaymentGateway(data?.id, inputs);
      }
      await data;
      onClose();
    } catch (error) {
      console.error("Failed to save Stripe configuration:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl! w-full">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Stripe Configuration" : "Stripe Configuration"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update your Stripe payment configuration."
              : "Configure Stripe payment settings for your application."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-5 mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Stripe Mode */}
            <div>
              <Label htmlFor="stripeMode">Mode</Label>

              <select
                id="stripeMode"
                {...register("stripeMode")}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-150 outline-none mt-1"
              >
                <option value="test">Test</option>
                <option value="live">Live</option>
              </select>

              {errors.stripeMode && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.stripeMode.message}
                </p>
              )}
            </div>

            {/* Currency */}
            <div>
              <Label htmlFor="currency">Currency</Label>

              <select
                id="currency"
                {...register("currency")}
                className="w-full px-3 py-2 rounded-lg border text-sm transition-all duration-150 outline-none mt-1"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>

              {errors.currency && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.currency.message}
                </p>
              )}
            </div>

            {stripeMode === "live" && (
              <div className="col-span-2 -mt-3 flex items-start gap-2 px-3 py-2 rounded-lg text-xs bg-red-500/10 text-red-500">
                <span>
                  Live mode will charge real cards. Make sure your integration
                  is fully tested before switching.
                </span>
              </div>
            )}

            {/* Publishable Key */}
            <div className="col-span-2">
              <div className="relative">
                <Input
                  {...register("stripePublishableKey")}
                  id="stripePublishableKey"
                  type={showKeys.publishable ? "text" : "password"}
                  className="plex-input text-sm w-full pr-10"
                  placeholder="pk_test_..."
                  label="Publishable Key"
                  error={errors.stripePublishableKey?.message}
                  required
                />

                <button
                  type="button"
                  onClick={() => toggleKey("publishable")}
                  className="absolute right-3 top-10.5 -translate-y-1/2"
                  aria-label={
                    showKeys.publishable
                      ? "Hide publishable key"
                      : "Show publishable key"
                  }
                >
                  {showKeys.publishable ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Secret Key */}
            <div className="col-span-2">
              <div className="relative">
                <Input
                  {...register("stripeSecretKey")}
                  id="stripeSecretKey"
                  type={showKeys.secret ? "text" : "password"}
                  className="plex-input text-sm w-full pr-10"
                  placeholder="sk_test_..."
                  label="Secret Key"
                  error={errors.stripeSecretKey?.message}
                  required
                />

                <button
                  type="button"
                  onClick={() => toggleKey("secret")}
                  className="absolute right-3 top-10.5 -translate-y-1/2"
                  aria-label={
                    showKeys.secret ? "Hide secret key" : "Show secret key"
                  }
                >
                  {showKeys.secret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Webhook Secret */}
            <div className="col-span-2">
              <div className="relative">
                <Input
                  {...register("stripeWebhookSecret")}
                  id="stripeWebhookSecret"
                  type={showKeys.webhook ? "text" : "password"}
                  className="plex-input text-sm w-full pr-10"
                  placeholder="whsec_..."
                  label="Webhook Secret"
                  error={errors.stripeWebhookSecret?.message}
                  required
                />

                <button
                  type="button"
                  onClick={() => toggleKey("webhook")}
                  className="absolute right-3 top-10.5 -translate-y-1/2"
                  aria-label={
                    showKeys.webhook
                      ? "Hide webhook secret"
                      : "Show webhook secret"
                  }
                >
                  {showKeys.webhook ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Success URL */}
            <div className="col-span-2">
              <Input
                {...register("paymentSuccessUrl")}
                id="paymentSuccessUrl"
                type="url"
                className="plex-input text-sm w-full"
                placeholder="https://example.com/payment-success"
                label="Payment Success URL"
                error={errors.paymentSuccessUrl?.message}
                required
              />
            </div>

            {/* Cancel URL */}
            <div className="col-span-2">
              <Input
                {...register("paymentCancelUrl")}
                id="paymentCancelUrl"
                type="url"
                className="plex-input text-sm w-full"
                placeholder="https://example.com/payment-cancel"
                label="Payment Cancel URL"
                error={errors.paymentCancelUrl?.message}
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="plex-button-secondary"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="plex-button-primary"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleConfig;
