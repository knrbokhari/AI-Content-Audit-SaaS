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
import { getRecentAudit } from "@/services/api";
import { Button } from "../ui/button";
import formatDate from "@/utils/formatDate";
import Link from "next/link";

interface Audit {
  id: number;
  createdBy: { name: string };
  url: string;
  overallScore: number;
  seoScore: number;
  createdAt: string;
}

export function RecentWebsiteAuditsTable() {
  const [result, setData] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRecentAudit();
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
          <TableHead>Website</TableHead>
          <TableHead>Audit Score</TableHead>
          <TableHead>AI Score</TableHead>
          <TableHead>created By</TableHead>
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
              <Button>
                <Link href={`/website-audits/${a?.id}/details`}>
                  View Report
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
