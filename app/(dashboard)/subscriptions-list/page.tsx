"use client";

import SubscriptionsList from "@/components/subscriptions/subscriptions-list";
import { SiteHeader } from "@/components/ui/site-header";

const Page = () => {
  return (
    <div>
      <SiteHeader title="Subscription List"></SiteHeader>
      <div className="mt-8 space-y-8">
        <SubscriptionsList isAdmin={true} />
      </div>
    </div>
  );
};

export default Page;
