/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createPlan, updatePlan } from "@/services/api";
import { Label } from "../ui/label";

const INTERVALS = [
  { value: "month", label: "Monthly" },
  { value: "year", label: "Yearly" },
  { value: "week", label: "Weekly" },
];

type FormValues = yup.InferType<typeof schema>;

const schema = yup.object({
  name: yup.string().required("Plan name is required"),
  description: yup.string().nullable(),
  amount: yup.number().typeError("Price is required").min(0).required(),
  currency: yup.string().required(),
  interval: yup.string().required(),
  intervalCount: yup.number().min(1).required(),
  trialDays: yup.number().min(0).required(),
  features: yup.string(),
});

const defaultValues: FormValues = {
  name: "",
  description: "",
  amount: 0,
  currency: "usd",
  interval: "month",
  intervalCount: 1,
  trialDays: 0,
  features: "",
};

const PlanFormModal = ({
  open,
  onClose,
  existing,
}: {
  open: boolean;
  onClose: () => void;
  existing?: any;
}) => {
  const isEdit = !!existing;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    if (!open) return;

    if (existing) {
      reset({
        name: existing.name || "",
        description: existing.description || "",
        amount: existing.price || "",
        currency: existing.currency || "usd",
        interval: existing.interval || "month",
        intervalCount: existing.intervalCount || 1,
        trialDays: existing.trialDays || 0,
        features: (existing.features || []).join(", "),
      });
    } else {
      reset(defaultValues);
    }
  }, [open, existing, reset]);

  const onSubmit = async (data: any) => {
    const features = data.features
      .split(",")
      .map((f: string) => f.trim())
      .filter(Boolean);

    if (isEdit) {
      await updatePlan(existing.productId, {
        name: data.name,
        description: data.description,
        features,
      });

      toast.success("Plan updated.");
    } else {
      await createPlan({
        ...data,
        amount: Number(data.amount),
        intervalCount: Number(data.intervalCount),
        trialDays: Number(data.trialDays),
        features,
      });

      toast.success("Plan created.");
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-[800px] !max-w-full">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Plan" : "Create Plan"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update your subscription plan."
              : "Create a new subscription plan."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input
                {...register("name")}
                className=" text-sm w-full"
                placeholder="Professional"
                label="Plan Name"
                error={errors.name?.message}
                required={true}
              />
            </div>

            <div className="col-span-2">
              <Input
                {...register("description")}
                className=" text-sm w-full"
                placeholder="Short description"
                label="Description"
                error={errors.description?.message}
              />
            </div>

            <div>
              <Input
                {...register("amount")}
                type="number"
                min="0"
                step="0.01"
                disabled={isEdit}
                className=" text-sm w-full"
                placeholder="99.00"
                label="Price"
                error={errors.amount?.message}
              />
            </div>

            <div>
              <Label htmlFor="interval" className="mb-1.5">Interval</Label>
              <select
                {...register("interval")}
                disabled={isEdit}
                className="w-full px-3 py-1.5 rounded-lg border text-sm transition-all duration-150 outline-none mt-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"
              >
                {INTERVALS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Input
                {...register("intervalCount")}
                type="number"
                min="1"
                disabled={isEdit}
                className=" text-sm w-full"
                placeholder="1"
                label="Billing Interval Count"
                error={errors.intervalCount?.message}
              />
            </div>

            <div>
              <Input
                {...register("trialDays")}
                type="number"
                min="0"
                disabled={isEdit}
                className=" text-sm w-full"
                placeholder="0"
                label="Trial Days"
                error={errors.trialDays?.message}
              />
            </div>

            <div className="col-span-2">
              <Input
                {...register("currency")}
                disabled={isEdit}
                className=" text-sm w-full"
                placeholder="usd"
                label="Currency"
                error={errors.currency?.message}
              />
            </div>
          </div>

          <textarea
            {...register("features")}
            rows={4}
            className=" text-sm resize-none w-full"
            placeholder="Unlimited campaigns, Email support, 500 targets"
          />

          {isEdit && (
            <div
              className="rounded-lg p-3 text-xs"
              style={{
                background: "var(--bg-surface-2)",
                color: "var(--text-tertiary)",
              }}
            >
              Price and billing interval cannot be changed after creation
              because Stripe creates a new Price object for pricing changes.
              Create a new plan instead.
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="plex-button-secondary"
            >
              Cancel
            </Button>

            <Button type="submit" className="plex-button-primary">
              {isEdit ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanFormModal;
