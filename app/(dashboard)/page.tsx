"use client";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/ui/site-header";
import { RecentOrganizationsTable } from "@/components/dashboard/recent-organizations-table";
import { RecentPaymentsTable } from "@/components/dashboard/recent-payments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentWebsiteAuditsTable } from "@/components/dashboard/recent-website-audits-table";
import { LatestUserRegistrationsTable } from "@/components/dashboard/latest-user-registration-table";
import { useRouter } from "next/navigation";
import { RecentInvoiceTable } from "@/components/dashboard/recent-invoice-table";
import AdminDashboardCard from "@/components/dashboard/admin-dashboard-card";
import DashboardCard from "@/components/dashboard/dashboard-card";
import { Permissions } from "@/lib/permissions";
import Can from "@/components/guards/CanView";

export default function Home() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <SiteHeader title="Dashboard">
        <Can permissions={[Permissions.WebsiteAudits.Create]} require="any">
          <Button
            onClick={() => router.push("/website-audits/create")}
            size="lg"
            variant="default"
          >
            Create Audit
          </Button>
        </Can>
      </SiteHeader>
      <Can permissions={[Permissions.AdminDashboard.View]} require="any">
        <AdminDashboardCard />
      </Can>
      <Can permissions={[Permissions.Dashboard.View]} require="any">
        <DashboardCard />
      </Can>
      <div className="grid grid-cols-1 gap-6">
        <Can permissions={[Permissions.AdminDashboard.View]} require="any">
          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentOrganizationsTable />
            </CardContent>
          </Card>
        </Can>
        <Can permissions={[Permissions.AdminDashboard.View]} require="any">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentPaymentsTable />
            </CardContent>
          </Card>
        </Can>
        <Can permissions={[Permissions.AdminDashboard.View]} require="any">
          <Card>
            <CardHeader>
              <CardTitle>Latest User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              <LatestUserRegistrationsTable />
            </CardContent>
          </Card>
        </Can>
        <Can permissions={[Permissions.Dashboard.View]} require="any">
          <Card>
            <CardHeader>
              <CardTitle>Recent Website Audits</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentWebsiteAuditsTable />
            </CardContent>
          </Card>
        </Can>
        <Can permissions={[Permissions.Dashboard.View]} require="any">
          <Card>
            <CardHeader>
              <CardTitle>Latest Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentInvoiceTable />
            </CardContent>
          </Card>
        </Can>
      </div>
    </div>
  );
}
