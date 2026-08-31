/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { WebsiteAuditsDetails } from "./website-audits-details";
import { createWebsiteAudits } from "@/services/api";

const Schema = yup.object().shape({
  url: yup
    .string()
    .required("URL is required")
    .min(2, "URL must be at least 2 characters")
    .max(200, "URL must not exceed 200 characters"),
});

export type FormValues = yup.InferType<typeof Schema>;

const WebsiteAuditsForm = () => {
  const [data, setData]: any = useState({});
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(Schema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const res = await createWebsiteAudits(values);
      setData(res);
      toast.success(res?.message || "Audits retrieved successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to get audits");
      setError("root", {
        type: "submit",
        message: "Failed to get audits",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap sm:my-8">
          <Card className="w-full">
            <CardContent className="">
              <Label className="mb-2">Audits Url:</Label>

              <div className="flex justify-between gap-3 items-center">
                <Input {...register("url")} className="w-full flex-1" />
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Analyzing..." : "Audits"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {!!data?.id && <WebsiteAuditsDetails data={data} />}
    </div>
  );
};

export default WebsiteAuditsForm;
