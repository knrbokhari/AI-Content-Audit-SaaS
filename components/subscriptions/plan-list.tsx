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
import { TableSkeleton } from "../ui/skeleton";

const PlanList = () => {
  const [isPlanData, setIsPlanData] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getPlans();
      setPlans(data);
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

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center py-10">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  const toggleActive = (id: number) => {
    // setPlans((prev) =>
    //   prev.map((plan) =>
    //     plan.id === id ? { ...plan, active: !plan.active } : plan,
    //   ),
    // );
  };

  return (
    <>
      <Card className="!p-4">
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
            {loading && <TableSkeleton items={5} cell={6} />}
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>
                  ${plan.price}/{plan.interval}
                </TableCell>
                <TableCell>{plan.trialDays}</TableCell>
                <TableCell>{plan.subscriberCount}</TableCell>
                <TableCell>{plan.features.join(", ")}</TableCell>
                <TableCell className="flex gap-2">
                  {/* <Button
                    variant={plan.productActive ? "destructive" : "outline"}
                    onClick={() => toggleActive(plan.id)}
                  >
                    {plan.productActive ? "Deactivate" : "Activate"}
                  </Button> */}
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
