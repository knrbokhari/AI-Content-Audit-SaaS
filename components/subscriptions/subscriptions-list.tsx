import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "../ui/card";

const SubscriptionsList = () => {
  // Sample subscription data
  const [subscriptions] = useState([
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

  return (
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
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.subscriptionId}>
              <TableCell>{sub.customer}</TableCell>
              <TableCell>{sub.subscriptionId}</TableCell>
              <TableCell>{sub.planName}</TableCell>
              <TableCell>{sub.status}</TableCell>
              <TableCell>{sub.startDate}</TableCell>
              <TableCell>{sub.endDate}</TableCell>
              <TableCell>{sub.amount}</TableCell>
              <TableCell>{sub.paymentMethod}</TableCell>
              <TableCell>{sub.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default SubscriptionsList;
