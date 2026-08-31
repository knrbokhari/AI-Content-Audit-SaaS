/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { SiteHeader } from "@/components/ui/site-header";
import { LoadingSpinner } from "@/components/ui/spinner";
import { WebsiteAuditsDetails } from "@/components/website-audits/website-audits-details";
import { getWebsiteAuditDetails } from "@/services/api";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const params = useParams<{ slug: string }>();

  const [data, setData]: any = useState({});
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const data = await getWebsiteAuditDetails(params.slug);
        setData(data);
      } catch (error) {
        console.error("Error fetching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermission();
  }, [params.slug]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <SiteHeader title="Website Audits Details"></SiteHeader>
      <div className="mt-5"></div>
      <WebsiteAuditsDetails data={data} />
    </div>
  );
};

export default page;
