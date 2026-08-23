/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Card } from "../ui/card";
import { LoadingSpinner } from "../ui/spinner";
import { getOrganizations } from "@/services/api";

const OrganizationsList = () => {
  // Dummy data – replace with real API data
  const [orgs, setOrgs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchOrgs = async () => {
    try {
      setLoading(true);
      const res = await getOrganizations({ page, size: 10 });
      const { data, ...rest } = res;
      setOrgs(data);
      setPagination(rest);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrgs();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Card className="mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization Name</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Total Audit</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead>Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orgs.map((org: any) => (
            <TableRow key={org.id}>
              <TableCell>{org.name}</TableCell>
              <TableCell>{org.subscriptions?.[0]?.planName || "-"}</TableCell>
              <TableCell>{org.domain}</TableCell>
              <TableCell>{org._count.users}</TableCell>
              <TableCell>{org._count.audits}</TableCell>
              <TableCell>{org.branding?.website || "NA"}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    org.subscriptions?.planName === "active"
                      ? "default"
                      : org.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {org.subscriptions?.planName || "Free"}
                </Badge>
              </TableCell>
              {/* <TableCell className="flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm" variant="outline" color="red">
                  Block
                </Button>
                <Button size="sm" variant="outline" color="green">
                  Send Payment Email
                </Button>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OrganizationsList;
