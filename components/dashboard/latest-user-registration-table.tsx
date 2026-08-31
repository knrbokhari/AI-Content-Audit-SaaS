/* eslint-disable react-hooks/set-state-in-effect */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentUserRegistrations } from "@/services/api";
import formatDate from "@/utils/formatDate";
import { useEffect, useState } from "react";
import { TableSkeleton } from "../ui/skeleton";

interface User {
  name: string;
  email: string;
  phone: string;
  organization: {
    name: string;
  };
  role: {
    name: string;
  };
  plan_type: string;
  created_at: string;
}

export function LatestUserRegistrationsTable() {
  const [result, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRecentUserRegistrations();
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
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Organization</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Joined Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading && <TableSkeleton items={3} cell={6} />}
        {result.map((p: User, idx) => (
          <TableRow key={idx}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.email}</TableCell>
            <TableCell>{p.organization?.name}</TableCell>
            <TableCell>{p.role.name}</TableCell>
            <TableCell>{p.plan_type || "-"}</TableCell>
            <TableCell>{formatDate(p.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
