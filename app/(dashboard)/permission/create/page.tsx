import { PermissionForm } from "@/components/permission/permission-from";
import { SiteHeader } from "@/components/ui/site-header";

const page = () => {
  return (
    <div>
      <SiteHeader title="Create Permission"></SiteHeader>
      <PermissionForm />
    </div>
  );
};

export default page;
