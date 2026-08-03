/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./badge";


interface KPIProps {
  title: string;
  value: string | number;
  percentage: number | undefined;
  icon: any;
  color: any;
}

export function KPICard({ title, value, percentage, icon: Icon, color }: KPIProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center space-x-2">
          {Icon && <Icon className="h-5 w-5" />}
          <span>{title}</span>
        </CardTitle>
        {!!percentage && <Badge variant={percentage >= 0 ? "default" : "destructive"}>
          {percentage >= 0 ? "+" : "-"}{Math.abs(percentage)}%
        </Badge>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        
      </CardContent>
    </Card>
  );
}
