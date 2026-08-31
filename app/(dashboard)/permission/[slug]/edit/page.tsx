/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import PermissionGuard from "@/components/guards/PermissionGuard";
import { PermissionForm } from "@/components/permission/permission-from";
import { SiteHeader } from "@/components/ui/site-header";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Permissions } from "@/lib/permissions";
import { getPermission } from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const params = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    action: string;
    id?: string | number | undefined;
    resourceId: number;
    roleId: number;
  } | null>(null);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const data = await getPermission(params.slug);
        setData(data);
      } catch (error) {
        console.error("Error fetching permission:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermission();
  }, [params.slug]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Permission not found.</p>
      </div>
    );
  }

  return (
    <PermissionGuard permission={Permissions.Permission.Update}>
      <SiteHeader title="Update Permission"></SiteHeader>
      <PermissionForm initialValues={data} />
    </PermissionGuard>
  );
};

export default page;
