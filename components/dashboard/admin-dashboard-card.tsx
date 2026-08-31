/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { KPICard } from "../ui/kpi-card";
import { Users, DollarSign, TrendingUp, User } from "lucide-react";
import { getAdminDashboardReport } from "@/services/api";
import { KPICardLoading } from "../ui/skeleton";

interface Data {
  total_user: number;
  total_organization: number;
  total_revenue: number;
  total_audit: number;
}

const AdminDashboardCard = () => {
  const [result, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardReport();
      setData(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICardLoading />
        <KPICardLoading />
        <KPICardLoading />
        <KPICardLoading />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Users"
        value={result?.total_user || 0}
        percentage={0}
        icon={User}
        color={undefined}
      />
      <KPICard
        title="Total Organizations"
        value={result?.total_organization || 0}
        percentage={0}
        icon={Users}
        color={undefined}
      />
      <KPICard
        title="Total Revenue"
        value={result?.total_revenue || 0}
        percentage={0}
        icon={DollarSign}
        color={undefined}
      />
      <KPICard
        title="Total Audits"
        value={result?.total_audit || 0}
        percentage={0}
        icon={TrendingUp}
        color={undefined}
      />
    </div>
  );
};

export default AdminDashboardCard;
