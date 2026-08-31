"use client";

import { RecentInvoiceTable } from "@/components/dashboard/recent-invoice-table";
import SubscriptionsList from "@/components/subscriptions/subscriptions-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/ui/site-header";

const Page = () => {
  return (
    <div>
      <SiteHeader title="Subscription List"></SiteHeader>
      <div className="mt-8 space-y-8">
        <SubscriptionsList />

        <Card>
          <CardHeader>
            <CardTitle>Latest Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentInvoiceTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
