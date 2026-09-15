/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { SiteHeader } from "@/components/ui/site-header";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { KPICard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Sparkles,
  Cpu,
  Award,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { getAiUseDetails } from "@/services/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import formatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";

const Page = () => {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getAiUseDetails(params.slug);
        setData(res);
      } catch (error) {
        console.error("Error fetching AI use details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchDetails();
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  const organization = data?.organization;
  const usage = data?.usage;
  const recentAudits = data?.recentAudits || [];

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle2 className="size-3" />
            {status}
          </Badge>
        );
      case "pending":
      case "processing":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="size-3" />
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3" />
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <SiteHeader
        title={`Organization AI Used: ${organization?.name || params.slug}`}
      >
        <Button variant="outline" onClick={() => router.push("/ai-uses")}>
          Back to AI Report
        </Button>
      </SiteHeader>

      {/* Organization Info Card */}
      <Card className="bg-muted/20">
        <CardContent className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Organization Details
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              {organization?.name || "Unknown Organization"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Organization ID: {organization?.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
              <Building2 className="size-4 mr-1.5 text-primary" />
              Active Organization
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Usage KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Audits"
          value={usage?.totalAudits || 0}
          icon={Sparkles}
          color="#4D8EF7"
        />
        <KPICard
          title="Token Usage Count"
          value={usage?.tokenUsageCount || 0}
          icon={Cpu}
          color="#f59e0b"
        />
        <KPICard
          title="Total Tokens"
          value={usage?.totalTokens?.toLocaleString() || 0}
          icon={Award}
          color="#22c55e"
        />
        <KPICard
          title="Average Tokens"
          value={usage?.averageTokens?.toLocaleString() || 0}
          icon={Building2}
          color="#8b5cf6"
        />
      </div>

      {/* Recent Audits Table */}
      <Card className="p-4!">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Recent Audits ({recentAudits.length})
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Audit Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>AI Tokens Used</TableHead>
              <TableHead className="text-right">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentAudits.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No recent audits found for this organization.
                </TableCell>
              </TableRow>
            ) : (
              recentAudits.map((audit: any) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">
                    {audit.title || `Audit #${audit.id}`}
                  </TableCell>
                  <TableCell>
                    {audit.url ? (
                      <a
                        href={audit.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline truncate max-w-xs block"
                      >
                        {audit.url}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(audit.status)}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {audit.aiTokensUsed?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatDate(audit.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

Page.displayName = "AiUseDetailsPage";

export default Page;
