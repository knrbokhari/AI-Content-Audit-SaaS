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

  useEffect(() => {
    if (!user) return;

    if (!user.plan_type) {
      // router.replace("/plan");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  // if (!user.plan_type) {
  //   return null;
  // }

  return <>{children}</>;
}
