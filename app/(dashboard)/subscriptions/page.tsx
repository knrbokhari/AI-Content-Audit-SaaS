"use client";

import SubscriptionsList from "@/components/subscriptions/subscriptions-list";
import { KPICard } from "@/components/ui/kpi-card";
import { SiteHeader } from "@/components/ui/site-header";
import { AlertTriangle, CreditCard, Package,  Zap } from "lucide-react";

const Page = () => {
  return (
    <div>
      <SiteHeader title="Subscription List"></SiteHeader>
      <div className="mt-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total subscriptions"
            value={0}
            icon={CreditCard}
            color="#4D8EF7"
            percentage={undefined}
          />
          <KPICard
            title="Monthly recurring"
            value={0}
            icon={Zap}
            color="#22c55e"
            percentage={undefined}
          />
          <KPICard
            title="Past due"
            value={0}
            icon={AlertTriangle}
            color="#f59e0b"
            percentage={undefined}
          />
          <KPICard
            title="Active plans"
            value={0}
            icon={Package}
            color="#8b5cf6"
            percentage={undefined}
          />
        </div>

        <SubscriptionsList />
      </div>
    </div>
  );
};

export default Page;
