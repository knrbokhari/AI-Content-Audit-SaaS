/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import PlanFormModal from "./plan-form";

const PlanList = () => {
  const [isPlanData, setIsPlanData] = useState<any>(null);
  // Sample data for plans
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic",
      price: "$9.99/month",
      trial: "14 days",
      subscribers: 1200,
      features: ["Feature A", "Feature B"],
      active: true,
    },
    {
      id: 2,
      name: "Pro",
      price: "$29.99/month",
      trial: "30 days",
      subscribers: 450,
      features: ["Feature A", "Feature B", "Feature C"],
      active: false,
    },
  ]);

  const toggleActive = (id: number) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id ? { ...plan, active: !plan.active } : plan,
      ),
    );
  };

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Trial</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.price}</TableCell>
                <TableCell>{plan.trial}</TableCell>
                <TableCell>{plan.subscribers}</TableCell>
                <TableCell>{plan.features.join(", ")}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant={plan.active ? "destructive" : "outline"}
                    onClick={() => toggleActive(plan.id)}
                  >
                    {plan.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsPlanData(plan)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <PlanFormModal
        open={!!isPlanData}
        onClose={() => setIsPlanData(null)}
        existing={isPlanData}
      />
    </>
  );
};

export default PlanList;
