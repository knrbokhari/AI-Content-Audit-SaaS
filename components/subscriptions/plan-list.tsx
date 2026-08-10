/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
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
import { LoadingSpinner } from "../ui/spinner";
import { toast } from "sonner";
import { getPlans } from "@/services/api";

const PlanList = () => {
  const [isPlanData, setIsPlanData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([
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
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getPlans();
      setPlans(data?.data);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      toast.error(error?.message || "Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  const toggleActive = (id: number) => {
    // setPlans((prev) =>
    //   prev.map((plan) =>
    //     plan.id === id ? { ...plan, active: !plan.active } : plan,
    //   ),
    // );
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
