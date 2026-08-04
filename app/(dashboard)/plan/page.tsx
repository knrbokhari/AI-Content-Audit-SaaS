"use client";

import PlanFormModal from "@/components/subscriptions/plan-form";
import PlanList from "@/components/subscriptions/plan-list";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/ui/site-header";
import { useState } from "react";

const Page = () => {
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);

  return (
    <div>
      <SiteHeader title="Plans List">
        <Button size="lg" variant="default" onClick={() => setIsPlanFormOpen(true)}>
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
    </div>
  );
};

export default Page;
