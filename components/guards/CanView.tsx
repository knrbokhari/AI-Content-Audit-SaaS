"use client";

import { permissionsAtom } from "@/atoms/permissionAtom";
import { useAtom } from "jotai";
import { ReactNode } from "react";

type CanProps = {
  permission?: string;
  permissions?: string[];
  require?: "any" | "all";
  children: ReactNode;
  fallback?: ReactNode;
};

export default function Can({
  permission,
  permissions,
  require = "any",
  children,
  fallback = null,
}: CanProps) {
  const [userPermissions, setPermissions] = useAtom(permissionsAtom);

  // Merge single and multiple permissions
  const requiredPermissions = [
    ...(permission ? [permission] : []),
    ...(permissions ?? []),
  ];

  // If no permission is provided, allow rendering
  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const allowed =
    require === "all"
      ? requiredPermissions.every((p) => userPermissions.includes(p))
      : requiredPermissions.some((p) => userPermissions.includes(p));

  return allowed ? <>{children}</> : <>{fallback}</>;
}
