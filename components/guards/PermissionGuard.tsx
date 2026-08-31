"use client";

import { permissionsAtom } from "@/atoms/permissionAtom";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  permission: string;
  children: React.ReactNode;
};

export default function PermissionGuard({ permission, children }: Props) {
  const router = useRouter();
  const [permissions, setPermissions] = useAtom(permissionsAtom);

  if (permissions.length === 0) {
    setPermissions([
      "users:view",
      "users:create",
      "users:update",
      "users:delete",
      "reports:view",
      "billing:view",
      "settings:view",
      "roles:view",
    ]);
  }

  const allowed = permissions.includes(permission);

  useEffect(() => {
    if (!allowed) {
      router.replace("/403");
    }
  }, [allowed, router]);

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
