/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { WebsiteAuditsDetails } from "./website-audits-details";

const Schema = yup.object().shape({
  url: yup
    .string()
    .required("URL is required")
    .min(2, "URL must be at least 2 characters")
    .max(200, "URL must not exceed 200 characters"),
});

export type FormValues = yup.InferType<typeof Schema>;

const scores = {
  overall: 85,
  seo: 90,
  contentQuality: 80,
  readability: 75,
  accessibility: 70,
  performance: 95,
};

const stats = {
  wordCount: 1200,
  readingTime: "5 min",
  images: 10,
  imagesMissingAlt: 2,
  internalLinks: 15,
  externalLinks: 5,
  brokenLinks: 1,
  metaTitleLength: 60,
  metaDescriptionLength: 150,
  headings: 8,
  primaryKeyword: "example",
  keywordDensity: 1.5,
};

const improvement = {
  previousContent: "This is the previous content of the website.",
  improvedContent: "This is the improved content of the website with better SEO and readability.",
};


const WebsiteAuditsForm = () => {
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
      const res = { message: "Audits retrieved successfully" }; // Replace with actual API call
      reset();
      toast.success(res?.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to get audits");
      setError("root", {
        type: "submit",
        message: "Failed to get audits",
      });
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
                <Input {...register("url")} className="w-full" />
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Analyzing..." : "Audits"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      <WebsiteAuditsDetails improvement={improvement} scores={scores} stats={stats} />
    </div>
  );
};

export default WebsiteAuditsForm;
