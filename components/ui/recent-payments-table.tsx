import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "./badge";

interface Payment {
  organization: string;
  invoiceId: string;
  amount: number;
  method: string;
  date: string;
  status: "paid" | "pending" | "failed";
}

const data: Payment[] = [
  { organization: "Acme Corp", invoiceId: "INV-001", amount: 1200, method: "Credit Card", date: "2024-03-01", status: "paid" },
  { organization: "Beta Ltd", invoiceId: "INV-002", amount: 300, method: "Bank Transfer", date: "2024-03-05", status: "pending" },
  { organization: "Gamma Inc", invoiceId: "INV-003", amount: 4500, method: "PayPal", date: "2024-02-28", status: "failed" },
];

export function RecentPaymentsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization</TableHead>
          <TableHead>Invoice ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((p, idx) => (
          <TableRow key={idx}>
            <TableCell>{p.organization}</TableCell>
            <TableCell>{p.invoiceId}</TableCell>
            <TableCell>${p.amount}</TableCell>
            <TableCell>{p.method}</TableCell>
            <TableCell>{p.date}</TableCell>
            <TableCell>
              <Badge variant={p.status === "paid" ? "success" : p.status === "pending" ? "warning" : "destructive"}>
                {p.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>View</DropdownMenuItem>
                  <DropdownMenuItem>Retry</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
