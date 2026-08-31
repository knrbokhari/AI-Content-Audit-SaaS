"use client";

import { SiteHeader } from "@/components/ui/site-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ResourceList } from "@/components/resource/resource-list";

const Page = () => {
  const router = useRouter();
  return (
    <div>
      <SiteHeader title="Resources List">
        <Button
          size="lg"
          variant="default"
          onClick={() => router.push("/resource/create")}
        >
          Create Resource
        </Button>
      </SiteHeader>
      <div className="p-4">
        <ResourceList />
      </div>
    </div>
  );
};

export default Page;
