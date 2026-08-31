/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { getRecentPayments } from "@/services/api";
import formatDate from "@/utils/formatDate";
import { TableSkeleton } from "../ui/skeleton";

interface Payment {
  organization: string;
  invoiceId: string;
  amount: number;
  method: string;
  date: string;
  status: "paid" | "pending" | "failed";
}

const data: Payment[] = [
  {
    organization: "Acme Corp",
    invoiceId: "INV-001",
    amount: 1200,
    method: "Credit Card",
    date: "2024-03-01",
    status: "paid",
  },
  {
    organization: "Beta Ltd",
    invoiceId: "INV-002",
    amount: 300,
    method: "Bank Transfer",
    date: "2024-03-05",
    status: "pending",
  },
  {
    organization: "Gamma Inc",
    invoiceId: "INV-003",
    amount: 4500,
    method: "PayPal",
    date: "2024-02-28",
    status: "failed",
  },
];

export function RecentPaymentsTable() {
  const [result, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRecentPayments();
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Plan Name</TableHead>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          {/* <TableHead>Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading && <TableSkeleton items={3} cell={6} />}
        {result.map((p: any, idx) => (
          <TableRow key={idx}>
            <TableCell>{p.planName}</TableCell>
            <TableCell>{p.stripeCustomerId}</TableCell>
            <TableCell>
              ${p.amount}/{p.interval}
            </TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell>{formatDate(p.createdAt)}</TableCell>
            <TableCell>
              <Badge
                variant={
                  p.status === "paid"
                    ? "secondary"
                    : p.status === "pending"
                      ? "outline"
                      : "destructive"
                }
              >
                {p.status}
              </Badge>
            </TableCell>
            {/* <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Retry</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
