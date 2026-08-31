"use client";

import { SiteHeader } from "@/components/ui/site-header";
import { RoleList } from "@/components/role/role-list";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div>
      <SiteHeader title="Roles List">
        <Button
          size="lg"
          variant="default"
          onClick={() => router.push("/role/create")}
        >
          Create Role
        </Button>
      </SiteHeader>
      <div className="p-4">
        <RoleList />
      </div>
    </div>
  );
};

export default Page;
