import { RoleForm } from "@/components/role/role-from";
import { SiteHeader } from "@/components/ui/site-header";

const page = () => {
  return (
    <div>
      <SiteHeader title="Create Role"></SiteHeader>
      <RoleForm />
    </div>
  );
};

export default page;
