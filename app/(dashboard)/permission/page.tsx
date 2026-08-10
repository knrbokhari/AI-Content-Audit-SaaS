"use client";

import { SiteHeader } from "@/components/ui/site-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { PermissionList } from "@/components/permission/permission-list";
import PermissionGuard from "@/components/guards/PermissionGuard";
import { Permissions } from "@/lib/permissions";

const Page = () => {
  const router = useRouter();
  return (
    <PermissionGuard permission={Permissions.Permission.View}>
      <SiteHeader title="Permission List">
        <Button
          size="lg"
          variant="default"
          onClick={() => router.push("/permission/create")}
        >
          Create Permission
        </Button>
      </SiteHeader>
      <div className="p-4">
        <PermissionList />
      </div>
    </PermissionGuard>
  );
};

export default Page;
