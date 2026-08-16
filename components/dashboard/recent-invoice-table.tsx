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

interface Audit {
  createdBy: { name: string };
  url: string;
  overallScore: number;
  seoScore: number;
  createdAt: string;
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
          <TableHead>Plan</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Audits</TableHead>
          <TableHead>Created Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((a, idx) => (
          <TableRow key={idx}>
            <TableCell>{a.url}</TableCell>
            <TableCell>{a.overallScore}</TableCell>
            <TableCell>{a.seoScore}</TableCell>
            <TableCell>{a.createdBy.name}</TableCell>
            <TableCell>{formatDate(a.createdAt)}</TableCell>
            <TableCell>
              <Button>View</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
