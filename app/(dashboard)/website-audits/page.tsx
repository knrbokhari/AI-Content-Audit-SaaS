"use client";

import { SiteHeader } from "@/components/ui/site-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WebsiteAuditsList } from "@/components/website-audits/website-audits-list";

const Page = () => {
  const router = useRouter();
  return (
    <div>
      <SiteHeader title="Audits List">
        <Button
          size="lg"
          variant="default"
          onClick={() => router.push("/website-audits/create")}
        >
          Create Audits
        </Button>
      </SiteHeader>
      <div className="p-4">
        <WebsiteAuditsList />
      </div>
    </div>
  );
};

export default Page;
