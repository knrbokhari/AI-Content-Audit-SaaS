import { SiteHeader } from "@/components/ui/site-header";
import WebsiteAuditsForm from "@/components/website-audits/website-audits-form";

const page = () => {
  return (
    <div>
      <SiteHeader title="Create audits"></SiteHeader>
      <WebsiteAuditsForm />
    </div>
  );
};

export default page;

