/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./badge";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"

interface KPIProps {
  title: string
  value: string | number
  percentage?: number
  icon?: React.ComponentType<{ className?: string }>
  color?: string
  description?: string
}

export function KPICard({
  title,
  value,
  percentage,
  icon: Icon,
  color,
  description,
}: KPIProps) {
  const isPositive = percentage !== undefined && percentage >= 0
  const hasTrend = percentage !== undefined && percentage !== 0

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {Icon && (
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: color ? `${color}1a` : "var(--muted)",
                color: color ?? "var(--muted-foreground)",
              }}
            >
              <Icon className="size-4" />
            </span>
          )}
          <span>{title}</span>
        </CardTitle>

        {!!percentage && (
          <Badge
            variant={isPositive ? "default" : "destructive"}
            className="gap-1 font-medium"
          >
            {hasTrend &&
              (isPositive ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              ))}
            {isPositive ? "+" : "-"}
            {Math.abs(percentage)}%
          </Badge>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
