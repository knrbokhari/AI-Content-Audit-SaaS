/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { SiteHeader } from "@/components/ui/site-header";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import Description from "@/components/ui/description";
import { useEffect, useState } from "react";
import { creteBranding, getBranding, updateBranding } from "@/services/api";
import { LoadingSpinner } from "@/components/ui/spinner";

type FormValues = yup.InferType<typeof schema>;

// Define the form schema using yup
const schema = yup.object().shape({
  logo: yup.string().required("Logo is required"),
  primaryColor: yup.string().required("Primary color is required"),
  secondaryColor: yup.string().required("Secondary color is required"),
  primaryColorDark: yup.string().required("Primary dark color is required"),
  secondaryColorDark: yup.string().required("Secondary dark color is required"),
  logoUrl: yup
    .string()
    .url("Logo URL must be a valid URL")
    .required("Logo URL is required"),
});

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [brandingId, setBrandingId] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      logo: "",
      primaryColor: "",
      secondaryColor: "",
      primaryColorDark: "",
      secondaryColorDark: "",
      logoUrl: "",
    },
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getBranding();

      if (res) {
        setBrandingId(res.id);

        reset({
          logo: res.logo || "",
          primaryColor: res.primaryColor || "",
          secondaryColor: res.secondaryColor || "",
          primaryColorDark: res.primaryColorDark || "",
          secondaryColorDark: res.secondaryColorDark || "",
          logoUrl: res.logoUrl || "",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  const onSubmit = async (data: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
    primaryColorDark: string;
    secondaryColorDark: string;
    logoUrl: string;
  }) => {
    try {
      if (brandingId) {
        await updateBranding(brandingId, data);
      } else {
        await creteBranding(data);
      }

      const primary = data?.primaryColor;
      const secondary = data?.secondaryColor;
      const primaryDark = data?.primaryColorDark;
      const secondaryDark = data?.secondaryColorDark;

      if (primary)
        document.documentElement.style.setProperty("--brand-primary", primary);
      if (secondary)
        document.documentElement.style.setProperty(
          "--brand-secondary",
          secondary,
        );
      if (primaryDark)
        document.documentElement.style.setProperty(
          "--brand-primary-dark",
          primaryDark,
        );
      if (secondaryDark)
        document.documentElement.style.setProperty(
          "--brand-secondary-dark",
          secondaryDark,
        );
    } catch (error) {}
  };

  return (
    <div className="p-6">
      <SiteHeader title="Branding"></SiteHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title="Branding Information"
            details="Add your branding information from here"
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Logo</FieldLabel>
                <Input
                  type="text"
                  placeholder="Enter logo name"
                  {...register("logo")}
                  error={errors.logo?.message}
                />
              </Field>

              <Field>
                <FieldLabel>Logo URL</FieldLabel>
                <Input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  {...register("logoUrl")}
                  error={errors.logoUrl?.message}
                />
              </Field>
            </CardContent>
          </Card>
        </div>

        {/* <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title="Color Branding"
            details="Add your app color information from here"
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel>Primary Color</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    placeholder="#FFFFFF"
                    {...register("primaryColor")}
                    error={errors.primaryColor?.message}
                    className="w-10"
                  />
                  <Input
                    {...register("primaryColor")}
                    placeholder="#4D8EF7"
                    className="flex-1 !w-full"
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel>Secondary Color</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    placeholder="#000000"
                    {...register("secondaryColor")}
                    error={errors.secondaryColor?.message}
                    className="w-10"
                  />
                  <Input
                    {...register("secondaryColor")}
                    placeholder="#4D8EF7"
                    className="flex-1 !w-full"
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel>Primary Color Dark</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    placeholder="#000000"
                    {...register("primaryColorDark")}
                    error={errors.primaryColorDark?.message}
                    className="w-10"
                  />
                  <Input
                    placeholder="#111111"
                    {...register("primaryColorDark")}
                    className="flex-1 !w-full"
                  />
                </div>
              </Field>
              <Field>
                <FieldLabel>Secondary Color Dark</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    placeholder="#000000"
                    {...register("secondaryColorDark")}
                    error={errors.secondaryColorDark?.message}
                    className="w-10"
                  />
                  <Input
                    placeholder="#111111"
                    {...register("secondaryColorDark")}
                    className="flex-1 !w-full"
                  />
                </div>
              </Field>
            </CardContent>
          </Card>
        </div> */}
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title="Color Branding"
            details="Add your app color information from here"
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <CardContent className="space-y-6">
              {/* Primary Color */}
              <Field>
                <FieldLabel>Primary Color</FieldLabel>

                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder="#4D8EF7"
                    {...register("primaryColor")}
                    error={errors.primaryColor?.message}
                    className="flex-1"
                  />

                  <Input
                    type="color"
                    value={watch("primaryColor") || "#4D8EF7"}
                    onChange={(e) => setValue("primaryColor", e.target.value)}
                    className="h-10 w-12 cursor-pointer p-1"
                  />
                </div>
              </Field>

              {/* Secondary Color */}
              <Field>
                <FieldLabel>Secondary Color</FieldLabel>

                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder="#000000"
                    {...register("secondaryColor")}
                    error={errors.secondaryColor?.message}
                    className="flex-1"
                  />

                  <Input
                    type="color"
                    value={watch("secondaryColor") || "#000000"}
                    onChange={(e) => setValue("secondaryColor", e.target.value)}
                    className="h-10 w-12 cursor-pointer p-1"
                  />
                </div>
              </Field>

              {/* Primary Dark Color */}
              <Field>
                <FieldLabel>Primary Color Dark</FieldLabel>

                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder="#111111"
                    {...register("primaryColorDark")}
                    error={errors.primaryColorDark?.message}
                    className="flex-1"
                  />

                  <Input
                    type="color"
                    value={watch("primaryColorDark") || "#111111"}
                    onChange={(e) =>
                      setValue("primaryColorDark", e.target.value)
                    }
                    className="h-10 w-12 cursor-pointer p-1"
                  />
                </div>
              </Field>

              {/* Secondary Dark Color */}
              <Field>
                <FieldLabel>Secondary Color Dark</FieldLabel>

                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder="#222222"
                    {...register("secondaryColorDark")}
                    error={errors.secondaryColorDark?.message}
                    className="flex-1"
                  />

                  <Input
                    type="color"
                    value={watch("secondaryColorDark") || "#222222"}
                    onChange={(e) =>
                      setValue("secondaryColorDark", e.target.value)
                    }
                    className="h-10 w-12 cursor-pointer p-1"
                  />
                </div>
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 mb-4 justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting} className="">
            {isSubmitting ? "Saving…" : "Save Branding"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
