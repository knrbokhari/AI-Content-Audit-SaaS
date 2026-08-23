/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { KPICard } from "../ui/kpi-card";
import { Users, DollarSign, TrendingUp, ReceiptText, ChartColumn } from "lucide-react";
import { getDashboardReport } from "@/services/api";

interface Data {
  total_user: number;
  avg_audit_score: number;
  total_audit_score: number;
  total_audit: number;
}

const DashboardCard = () => {
  const [result, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardReport();
      setData(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Users"
        value={result?.total_user || 0}
        percentage={0}
        icon={Users}
        color={undefined}
      />
      <KPICard
        title="Total Audits"
        value={result?.total_audit || 0}
        percentage={0}
        icon={ReceiptText}
        color={undefined}
      />
      <KPICard
        title="Total Audit Score"
        value={result?.total_audit_score || 0}
        percentage={0}
        icon={ChartColumn}
        color={undefined}
      />
      <KPICard
        title="Avg Audit Score"
        value={result?.avg_audit_score || 0}
        percentage={0}
        icon={TrendingUp}
        color={undefined}
      />
      
    </div>
  );
};

export default DashboardCard;
