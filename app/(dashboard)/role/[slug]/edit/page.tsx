 
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { RoleForm } from "@/components/role/role-from";
import { SiteHeader } from "@/components/ui/site-header";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getRole } from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const params = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [roleData, setRoleData] = useState<{
    name: string;
    isSystem: boolean;
    id?: string | number | undefined;
  } | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const data = await getRole(params.slug);
        setRoleData(data);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [params.slug]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!roleData) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Role not found.</p>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader title="Update Role">{params.slug}</SiteHeader>
      <RoleForm initialValues={roleData} />
    </div>
  );
};

export default page;
