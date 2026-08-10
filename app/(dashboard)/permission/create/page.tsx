import PermissionGuard from "@/components/guards/PermissionGuard";
import { PermissionForm } from "@/components/permission/permission-from";
import { SiteHeader } from "@/components/ui/site-header";
import { Permissions } from "@/lib/permissions";

const page = () => {
  return (
    <PermissionGuard permission={Permissions.Permission.Create}>
      <SiteHeader title="Create Permission"></SiteHeader>
      <PermissionForm />
    </PermissionGuard>
  );
};

export default page;
