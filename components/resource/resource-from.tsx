"use client";

import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createResource, updateResource } from "@/services/api";
import Description from "../ui/description";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ResourceFormValues {
  id?: number | string;
  name: string;
}

interface ResourceFormProps {
  initialValues?: ResourceFormValues;
}

const ResourceSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
});

export function ResourceForm({
  initialValues = { name: "", id: undefined },
}: ResourceFormProps) {
  const isEditMode = !!initialValues?.id;
  const router = useRouter();

  const handleSubmit = async (
    values: ResourceFormValues,
    actions: FormikHelpers<ResourceFormValues>,
  ) => {
    try {
      if (isEditMode && initialValues?.id) {
        await updateResource(initialValues.id, values);
      } else {
        await createResource(values);
      }
      actions.resetForm();
      router.push("/resource");
      toast.success(`Resource ${isEditMode ? "updated" : "created"} successfully`);
    } catch (error) {
      console.error("Error saving resource:", error);
      actions.setStatus({ error: "Failed to save resource" });
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={ResourceSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, status }) => (
          <Form>
            <div className="my-5 flex flex-wrap sm:my-8">
              <Description
                title="Resource Information"
                details="Add your resource information and create a new resource from here"
                className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
              />
              <Card className="w-full sm:w-8/12 md:w-2/3">
                <CardContent className="space-y-4">
                  {status?.error && (
                    <div className="text-sm text-destructive">
                      {status.error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Name:</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Enter resource name"
                      className={
                        `px-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 ${touched.name && errors.name ? "border-destructive" : ""}`
                      }
                    />
                    {touched.name && errors.name && (
                      <div className="text-sm text-destructive">
                        {errors.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3 mb-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={router.back}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
