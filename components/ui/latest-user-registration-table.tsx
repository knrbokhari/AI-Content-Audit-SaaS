import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export function LatestUserRegistrationsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((p, idx) => (
          <TableRow key={idx}>
            <TableCell>{p.organization}</TableCell>
            <TableCell>{p.invoiceId}</TableCell>
            <TableCell>${p.amount}</TableCell>
            <TableCell>{p.method}</TableCell>
            <TableCell>{p.method}</TableCell>
            <TableCell>{p.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
