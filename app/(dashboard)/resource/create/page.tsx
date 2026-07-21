import { ResourceForm } from "@/components/resource/resource-from";
import { SiteHeader } from "@/components/ui/site-header";

const page = () => {
  return (
    <div>
      <SiteHeader title="Create Resource"></SiteHeader>
      <ResourceForm />
    </div>
  );
};

export default page;
