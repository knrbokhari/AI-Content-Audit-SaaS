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

const OrganizationsList = () => {
  // Dummy data – replace with real API data
  const [orgs] = useState([
    {
      id: 1,
      name: "Acme Corp",
      members: 12,
      avgScore: 4.5,
      package: "Pro",
      audits: 3,
      subscriptionEnd: "2026-12-31",
      status: "Active",
    },
    {
      id: 2,
      name: "Beta Ltd",
      members: 8,
      avgScore: 3.8,
      package: "Basic",
      audits: 1,
      subscriptionEnd: "2026-09-15",
      status: "Pending",
    },
  ]);

  return (
    <Card className="mt-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organization</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Average Score</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Audits</TableHead>
            <TableHead>Subscription End</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orgs.map((org) => (
            <TableRow key={org.id}>
              <TableCell>{org.name}</TableCell>
              <TableCell>{org.members}</TableCell>
              <TableCell>{org.avgScore}</TableCell>
              <TableCell>{org.package}</TableCell>
              <TableCell>{org.audits}</TableCell>
              <TableCell>{org.subscriptionEnd}</TableCell>
              <TableCell>
                <Badge
                  variant={org.status === "Active" ? "default" : "destructive"}
                >
                  {org.status}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm" variant="outline" color="red">
                  Block
                </Button>
                <Button size="sm" variant="outline" color="green">
                  Send Payment Email
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default OrganizationsList;
