import { SiteHeader } from "@/components/ui/site-header";
import { WebsiteAuditsDetails } from "@/components/website-audits/website-audits-details";
import React from "react";

const scores = {
  overall: 85,
  seo: 90,
  contentQuality: 80,
  readability: 75,
  accessibility: 70,
  performance: 95,
};

const stats = {
  wordCount: 1200,
  readingTime: "5 min",
  images: 10,
  imagesMissingAlt: 2,
  internalLinks: 15,
  externalLinks: 5,
  brokenLinks: 1,
  metaTitleLength: 60,
  metaDescriptionLength: 150,
  headings: 8,
  primaryKeyword: "example",
  keywordDensity: 1.5,
};

const improvement = {
  previousContent: "This is the previous content of the website.",
  improvedContent:
    "This is the improved content of the website with better SEO and readability.",
};

const page = () => {
  return (
    <div>
      <SiteHeader title="Website Audits Details"></SiteHeader>
      <div className="mt-5"></div>
      <WebsiteAuditsDetails
        improvement={improvement}
        scores={scores}
        stats={stats}
      />
    </div>
  );
};

export default page;
