/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPermission, updatePermission } from "@/services/api";
import Description from "../ui/description";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PermissionRoleInput from "./role-selection";
import PermissionResourceInput from "./resources-selection";
import PermissionAccessInput from "./access-selection";

const PermissionSchema = yup.object({
  roleId: yup
    .number()
    .transform((_, originalValue) => originalValue?.id)
    .required("Role is required"),
  resourceId: yup
    .number()
    .transform((_, originalValue) => originalValue?.id)
    .required("Resource is required"),
  action: yup
    .string()
    .transform((_, originalValue) => originalValue?.value)
    .required("Action is required"),
});

export type PermissionFormValues = yup.InferType<typeof PermissionSchema>;

interface PermissionFormProps {
  initialValues?: Partial<PermissionFormValues> & { id?: number | string };
}

export function PermissionForm({
  initialValues = {
    roleId: undefined,
    resourceId: undefined,
    action: "",
    id: undefined,
  },
}: PermissionFormProps) {
  const isEditMode = !!initialValues?.id;
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<PermissionFormValues>({
    resolver: yupResolver(PermissionSchema),
    defaultValues: {
      roleId: initialValues.roleId,
      resourceId: initialValues.resourceId,
      action: initialValues.action || "",
    },
  });

  const onSubmit = async (values: PermissionFormValues) => {
    try {
      if (isEditMode && initialValues?.id) {
        await updatePermission(initialValues.id, values);
      } else {
        await createPermission(values);
      }
      reset();
      router.push("/permission");
      toast.success(
        `Permission ${isEditMode ? "updated" : "created"} successfully`,
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save permission");
      console.error("Error saving permission:", error);
      setError("root", {
        type: "submit",
        message: "Failed to save permission",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap sm:my-8">
          <Description
            title="Permission Information"
            details="Add your permission information and create a new permission from here"
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <CardContent className="space-y-4">
              <PermissionRoleInput
                control={control}
                error={errors.roleId?.message}
              />
              <PermissionResourceInput
                control={control}
                error={errors.resourceId?.message}
              />
              <PermissionAccessInput
                control={control}
                error={errors.action?.message}
                setValue={setValue}
              />
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
      </form>
    </div>
  );
}


