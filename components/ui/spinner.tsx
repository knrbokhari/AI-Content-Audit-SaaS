import { cn } from "@/lib/utils";
import { LoaderIcon } from "lucide-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

function LoadingSpinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center justify-center",
      )}
      style={{ height: "calc(100vh - 200px)" }}
    >
      <LoaderIcon
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className={cn("size-7 animate-spin", className)}
        {...props}
      />
    </div>
  );
}

export { Spinner, LoadingSpinner };
