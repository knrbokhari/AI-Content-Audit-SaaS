import PermissionGuard from "@/components/guards/PermissionGuard";
import { Permissions } from "@/lib/permissions";
import React from "react";

const page = () => {
  return (
    <PermissionGuard permission={Permissions.Users.View}>
      <div>page</div>
    </PermissionGuard>
  );
};

export default page;
