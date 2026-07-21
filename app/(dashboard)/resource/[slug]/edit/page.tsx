 
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ResourceForm } from "@/components/resource/resource-from";
import { SiteHeader } from "@/components/ui/site-header";
import { LoadingSpinner } from "@/components/ui/spinner";
import { getResource } from "@/services/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const page = () => {
  const params = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [resourceData, setResourceData] = useState<{
    name: string;
    id?: string | number | undefined;
  } | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const data = await getResource(params.slug);
        setResourceData(data);
      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [params.slug]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!resourceData) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Resource not found.</p>
      </div>
    );
  }

  return (
    <div>
      <SiteHeader title="Update Resource">{params.slug}</SiteHeader>
      <ResourceForm initialValues={resourceData} />
    </div>
  );
};

export default page;
