import OrganizationsList from "@/components/organizations/organizations-list";
import { SiteHeader } from "@/components/ui/site-header";
import React from "react";

const page = () => {
  return (
    <div>
      <SiteHeader title="Organizations list"></SiteHeader>
      <OrganizationsList />
    </div>
  );
};

export default page;
