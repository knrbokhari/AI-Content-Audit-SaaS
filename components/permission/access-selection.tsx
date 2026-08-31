/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectInput from "@/components/ui/select-input";
import { useEffect } from "react";
import ValidationError from "@/components/ui/form-validation-error";
import { Control, useWatch } from "react-hook-form";
import { Label } from "../ui/label";
import { PermissionFormValues } from "./permission-from";

interface Props {
  control: Control<PermissionFormValues>;
  error: string | undefined;
  setValue: any;
  defaultValue?: string;
}

const PermissionAccessInput = ({
  control,
  error,
  setValue,
  defaultValue,
}: Props) => {
  const actions: any = [
    { name: "Read", value: "view" },
    { name: "Write", value: "create" },
    { name: "Update", value: "update" },
    { name: "Delete", value: "delete" },
  ];

  useEffect(() => {
    if (defaultValue) {
      const selected = actions.find((r: any) => r.value === defaultValue);
      if (selected) {
        setValue("action", selected);
      }
    }
  }, []);

  return (
    <div className="mb-5">
      <Label className="mb-2 block">Access*</Label>
      <SelectInput
        name="action"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.value}
        options={actions!}
        isClearable={true}
      />
      <ValidationError message={error!} />
    </div>
  );
};

export default PermissionAccessInput;
