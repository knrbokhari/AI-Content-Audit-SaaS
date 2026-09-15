/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectInput from "@/components/ui/select-input";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import ValidationError from "@/components/ui/form-validation-error";
import { getResources } from "@/services/api";
import { Resource } from "@/components/resource/resource-list";
import { PermissionFormValues } from "./permission-from";

interface Props {
  control: Control<PermissionFormValues>;
  error: string | undefined;
  setValue?: any;
  defaultValue?: string;
}

const PermissionResourceInput = ({
  control,
  error,
  setValue,
  defaultValue,
}: Props) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await getResources({ limit: 100 });
      setResources(data?.data);

      if (defaultValue) {
        const selected = data?.data?.find(
          (r: any) => r.id === Number(defaultValue),
        );
        if (selected) {
          setValue("resourceId", selected);
        }
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div className="mb-5">
      <Label className="mb-2 block">Resource*</Label>
      <SelectInput
        name="resourceId"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={resources!}
        isLoading={loading}
        isClearable={true}
      />
      <ValidationError message={error!} />
    </div>
  );
};

export default PermissionResourceInput;
