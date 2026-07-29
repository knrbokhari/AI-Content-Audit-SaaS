/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectInput from "@/components/ui/select-input";
import { useEffect, useState } from "react";
import { Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import ValidationError from "@/components/ui/form-validation-error";
import { getRoles } from "@/services/api";
import { Role } from "@/components/role/role-list";
import { PermissionFormValues } from "./permission-from";

interface Props {
  control: Control<PermissionFormValues>;
  error: string | undefined;
  setValue?: any;
  defaultValue?: string;
}

const PermissionRoleInput = ({
  control,
  error,
  setValue,
  defaultValue,
}: Props) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data?.data);

      if (defaultValue) {
        const selected = data?.data?.find((r: any) => r.id === Number(defaultValue));
        if (selected) {
          setValue("roleId", selected);
        }
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="mb-5">
      <Label className="mb-2 block">Role*</Label>
      <SelectInput
        name="roleId"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={roles!}
        isLoading={loading}
        isClearable={true}
      />
      <ValidationError message={error!} />
    </div>
  );
};

export default PermissionRoleInput;


// Curious, manusher nam, kotha bote gele karon lage, 
// chingri mach khai karon puka mach na, 
