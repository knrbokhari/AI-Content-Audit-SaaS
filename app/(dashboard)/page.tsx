import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/ui/site-header";
import { KPICard } from "@/components/ui/kpi-card";
import { Users, DollarSign, TrendingUp } from "lucide-react";
import { RecentOrganizationsTable } from "@/components/ui/recent-organizations-table";
import { RecentPaymentsTable } from "@/components/ui/recent-payments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentWebsiteAuditsTable } from "@/components/ui/recent-website-audits-table";
import { LatestUserRegistrationsTable } from "@/components/ui/latest-user-registration-table";

export default function Home() {
  return (
    <div className="space-y-6 p-4">
      <SiteHeader title="Dashboard">
        <Button size="lg" variant="default">
          Create Audit
        </Button>
      </SiteHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value={1200} percentage={12} icon={Users} />
        <KPICard title="Revenue" value="$45k" percentage={8} icon={DollarSign} />
        <KPICard title="Growth" value="+3.5%" percentage={3.5} icon={TrendingUp} />
        <KPICard title="Growth" value="+3.5%" percentage={3.5} icon={TrendingUp} />
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
