"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/userAtom";

type SubscriptionGuardProps = {
  children: React.ReactNode;
};

export default function SubscriptionGuard({
  children,
}: SubscriptionGuardProps) {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);

  if (!user) return;

  if (!user.plan_type && !user?.role?.isSystem) {
    router.replace("/chose-plan");
  }
  console.log(!user.plan_type && !user?.role?.isSystem);

  if (!user) {
    return null;
  }

  // if (!user.plan_type) {
  //   return null;
  // }

  return <>{children}</>;
}
