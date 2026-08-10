/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import RoleConfig from "@/components/role/role-config";
import PlanFormModal from "@/components/subscriptions/plan-form";
import PlanList from "@/components/subscriptions/plan-list";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/ui/site-header";
import { useState } from "react";

const Page = () => {
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  return (
    <div>
      <SiteHeader title="Plans List">
        <Button size="lg" variant="default" onClick={() => setConfigOpen(true)}>
          Config
        </Button>
        <Button
          size="lg"
          variant="default"
          onClick={() => setIsPlanFormOpen(true)}
        >
          Create Plan
        </Button>
      </SiteHeader>
      <div className="mt-8">
        <PlanList />
      </div>
      <PlanFormModal
        open={isPlanFormOpen}
        onClose={() => setIsPlanFormOpen(false)}
      />
      <RoleConfig onClose={() => setConfigOpen(false)} open={configOpen} />
    </div>
  );
};

export default Page;
