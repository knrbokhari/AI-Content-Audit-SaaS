"use client";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/ui/site-header";
import { KPICard } from "@/components/ui/kpi-card";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { RecentOrganizationsTable } from "@/components/dashboard/recent-organizations-table";
import { RecentPaymentsTable } from "@/components/dashboard/recent-payments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentWebsiteAuditsTable } from "@/components/dashboard/recent-website-audits-table";
import { LatestUserRegistrationsTable } from "@/components/dashboard/latest-user-registration-table";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="space-y-6 p-4">
      <SiteHeader title="Dashboard">
        <Button
          onClick={() => router.push("/website-audits/create")}
          size="lg"
          variant="default"
        >
          Create Audit
        </Button>
      </SiteHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Users"
          value={1200}
          percentage={12}
          icon={Users}
          color={undefined}
        />
        <KPICard
          title="Revenue"
          value="$45k"
          percentage={8}
          icon={DollarSign}
          color={undefined}
        />
        <KPICard
          title="Growth"
          value="+3.5%"
          percentage={3.5}
          icon={TrendingUp}
          color={undefined}
        />
        <KPICard
          title="Growth"
          value="+3.5%"
          percentage={3.5}
          icon={TrendingUp}
          color={undefined}
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrganizationsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentPaymentsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Website Audits</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentWebsiteAuditsTable />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <LatestUserRegistrationsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
