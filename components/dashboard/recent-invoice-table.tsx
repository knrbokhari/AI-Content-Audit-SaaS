/* eslint-disable react-hooks/set-state-in-effect */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getRecentInvoice } from "@/services/api";
import { Button } from "../ui/button";
import formatDate from "@/utils/formatDate";
import Link from "next/link";

interface Audit {
  stripeInvoiceId: string;
  amount: string;
  date: string;
  status: string;
  hostedInvoiceUrl: string;
}

export function RecentInvoiceTable() {
  const [result, setData] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRecentInvoice();
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
          <TableHead>Invoice ID</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((a, idx) => (
          <TableRow key={idx}>
            <TableCell>{a.stripeInvoiceId}</TableCell>
            <TableCell>{a.amount}</TableCell>
            <TableCell>{a.status}</TableCell>
            <TableCell>{formatDate(a.date)}</TableCell>
            <TableCell>
              <Button>
                <Link href={a?.hostedInvoiceUrl} target="_blank">
                  View
                </Link>{" "}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
