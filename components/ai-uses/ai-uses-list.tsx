/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { KPICard } from "@/components/ui/kpi-card";
import { Sparkles, Cpu, Award, Building2 } from "lucide-react";
import { getAiUses } from "@/services/api";
import { LoadingSpinner } from "@/components/ui/spinner";
import Pagination from "@/components/ui/pagination";
import { KPICardLoading, TableSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AiUsesList() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const router = useRouter();

  const fetchAiUses = async () => {
    try {
      setLoading(true);
      const res = await getAiUses({ page, limit });
      setData(res);
    } catch (error) {
      console.error("Failed to fetch AI uses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiUses();
  }, [page, limit]);

  const audits = data?.audits;
  const organizations = data?.organizations || [];
  const top3Organizations = data?.top3Organizations || [];
  const meta = data?.meta;

  const handleViewDetails = (organizationId: number | string) => {
    router.push(`/ai-uses/${organizationId}/details`);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading && !data ? (
          <>
            <KPICardLoading />
            <KPICardLoading />
            <KPICardLoading />
          </>
        ) : (
          <>
            <KPICard
              title="Total Audits"
              value={audits?.totalAudits || 0}
              icon={Sparkles}
              color="#4D8EF7"
            />
            <KPICard
              title="Token Usage Count"
              value={audits?.tokenUsageCount?.toLocaleString() || 0}
              icon={Cpu}
              color="#22c55e"
            />
            <KPICard
              title="Avg Token Usage"
              value={audits?.avgTokenUsage?.toLocaleString() || 0}
              icon={Award}
              color="#8b5cf6"
            />
          </>
        )}
      </div>

      {/* Top 3 Organizations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Award className="size-5 text-amber-500" />
            Top 3 Organizations by AI Token Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner />
            </div>
          ) : top3Organizations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No top organization records found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3Organizations.map((org: any, index: number) => (
                <Card
                  key={org.organizationId}
                  className="bg-muted/30 border-muted relative overflow-hidden"
                >
                  <CardContent className="pt-6">
                    <div className="absolute top-3 right-3 font-bold text-lg text-muted-foreground/40">
                      #{index + 1}
                    </div>
                    <div className="font-semibold text-base mb-1 truncate">
                      {org.organizationName || `Organization #${org.organizationId}`}
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      ID: {org.organizationId}
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-border/60">
                      <div>
                        <span className="text-muted-foreground text-xs block">Audits</span>
                        <span className="font-medium">{org.auditCount}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground text-xs block">Tokens Used</span>
                        <span className="font-medium text-primary">
                          {org.tokenUsage?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => handleViewDetails(org.organizationId)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Organizations Table List */}
      <Card className="p-4!">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            Organization AI Usage Breakdown
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization Name</TableHead>
              <TableHead>Organization ID</TableHead>
              <TableHead>Audit Count</TableHead>
              <TableHead>Token Usage</TableHead>
              <TableHead>Average Tokens</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableSkeleton items={5} cell={6} />
            ) : organizations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No organization usage data found.
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((org: any) => (
                <TableRow key={org.organizationId}>
                  <TableCell className="font-medium">
                    {org.organizationName || "Unknown Organization"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {org.organizationId}
                  </TableCell>
                  <TableCell>{org.auditCount}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {org.tokenUsage?.toLocaleString()}
                  </TableCell>
                  <TableCell>{org.averageTokens?.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(org.organizationId)}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!!meta?.totalOrganizations && (
          <div className="flex items-center justify-end mt-4">
            <Pagination
              total={meta.totalOrganizations}
              current={meta.page}
              pageSize={meta.limit}
              onChange={(current: number) => setPage(current)}
              showLessItems
            />
          </div>
        )}
      </Card>
    </div>
  );
}

AiUsesList.displayName = "AiUsesList";

