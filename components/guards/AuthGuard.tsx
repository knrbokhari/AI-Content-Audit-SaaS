/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCurrentUser } from "@/services/api";
import { userAtom } from "@/atoms/userAtom";
import { useAtom } from "jotai";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useState<string | null>(null);

  const fetchMe = async () => {
    try {
      const res = await apiCurrentUser();
      setUser(res);
    } catch {
      localStorage.removeItem("auth_token");
      setUser(null);
      router.replace("/login");
    }
  };

  useEffect(() => {
    const getToken = localStorage.getItem("auth_token");
    setToken(getToken);
    if (!getToken) {
      router.replace("/login");
    }

    if (token && !user) {
      fetchMe();
    }
  }, [token, router, user]);

  // if (!token) {
  //   return null;
  // }

  return <>{children}</>;
}
