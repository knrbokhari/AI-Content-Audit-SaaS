/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "../ui/card";
import { KPICard } from "../ui/kpi-card";
import { AlertTriangle, CreditCard, Package, Zap } from "lucide-react";
import { getAdminSubscriptions, getSubscriptions } from "@/services/api";
import { LoadingSpinner } from "../ui/spinner";
import formatDate from "@/utils/formatDate";

type TotalStats = {
  total_subscription?: number;
  monthly_recurring?: number;
  past_due?: number;
  active_plans?: number;
};

const SubscriptionsList = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  // Sample subscription data
  const [subscriptions, setSubscriptions] = useState([
    {
      customer: "Acme Corp",
      subscriptionId: "sub_001",
      planName: "Pro",
      status: "Active",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      amount: 99.99,
      paymentMethod: "Credit Card",
      details: "Monthly billing",
    },
    {
      customer: "Beta LLC",
      subscriptionId: "sub_002",
      planName: "Basic",
      status: "Past Due",
      startDate: "2023-06-15",
      endDate: "2024-06-15",
      amount: 49.99,
      paymentMethod: "PayPal",
      details: "Annual billing",
    },
  ]);
  const [total, setTotal] = useState<TotalStats>({});
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = isAdmin
        ? await getAdminSubscriptions({ page, size: 10 })
        : await getSubscriptions({ page, size: 10 });
      const { data, total, ...rest } = res;
      setSubscriptions(data);
      setPagination(rest);
      if (isAdmin) setTotal(total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total subscriptions"
            value={total.total_subscription || 0}
            icon={CreditCard}
            color="#4D8EF7"
            percentage={undefined}
          />
          <KPICard
            title="Monthly recurring"
            value={total.monthly_recurring || 0}
            icon={Zap}
            color="#22c55e"
            percentage={undefined}
          />
          <KPICard
            title="Past due"
            value={total?.past_due || 0}
            icon={AlertTriangle}
            color="#f59e0b"
            percentage={undefined}
          />
          <KPICard
            title="Active plans"
            value={total?.active_plans || 0}
            icon={Package}
            color="#8b5cf6"
            percentage={undefined}
          />
        </div>
      )}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Subscription ID</TableHead>
              <TableHead>Plan Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              {/* <TableHead>Details</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((sub: any) => (
              <TableRow key={sub.stripeSubscriptionId}>
                <TableCell>{sub.stripeCustomerId}</TableCell>
                <TableCell>{sub.stripeSubscriptionId}</TableCell>
                <TableCell>{sub.planName}</TableCell>
                <TableCell>{sub.status}</TableCell>
                <TableCell>{formatDate(sub.currentPeriodStart)}</TableCell>
                <TableCell>{formatDate(sub.currentPeriodEnd)}</TableCell>
                <TableCell>${sub.amount}</TableCell>
                <TableCell>Credit Card</TableCell>
                {/* <TableCell>{sub.details}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default SubscriptionsList;
