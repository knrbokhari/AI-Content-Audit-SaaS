/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";
import { TableCell, TableRow } from "./table";

interface TableSkeletonProps extends React.ComponentProps<"div"> {
  items?: number;
  cell?: number;
}

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

function KPICardLoading({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <Skeleton className=" h-10 mb-2 mt-5 w-full" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton({
  className,
  items = 3,
  cell = 3,
  ...props
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: items }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: cell }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 my-0.5 flex-1" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export { Skeleton, KPICardLoading, TableSkeleton };
