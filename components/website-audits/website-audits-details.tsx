import React from "react";
import { Card } from "../ui/card";
import { KPICard } from "../ui/kpi-card";

// Types for audit data – these would normally come from a backend API
interface AuditScore {
  overall: number;
  seo: number;
  contentQuality: number;
  readability: number;
  accessibility: number;
  performance: number;
}

interface AuditStats {
  wordCount: number;
  readingTime: string;
  images: number;
  imagesMissingAlt: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  metaTitleLength: number;
  metaDescriptionLength: number;
  headings: number;
  primaryKeyword: string;
  keywordDensity: number;
}

interface Improvement {
  previousContent: string;
  improvedContent: string;
}

interface Props {
  scores: AuditScore;
  stats: AuditStats;
  improvement: Improvement;
}

const ScoreCard: React.FC<{ title: string; value: number; color?: string }> = ({
  title,
  value,
  color = "#4f46e5",
}) => (
  <KPICard title={title} percentage={0} icon={null} value={value} color={color} />
);

const StatsCard: React.FC<{ title: string; value: string | number }> = ({
  title,
  value,
}) => (
  <Card className="p-4">
    <h4 className="text-sm font-medium text-gray-700">{title}</h4>
    <p className="mt-2 text-2xl font-bold">{value}</p>
  </Card>
);

export const WebsiteAuditsDetails: React.FC<Props> = ({ scores, stats, improvement }) => {

  return (
    <div className="">
      <h2 className="text-xl mb-6">Audit Details</h2>
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <ScoreCard title="Overall Score" value={scores.overall} />
        <ScoreCard title="SEO" value={scores.seo} />
        <ScoreCard title="Content Quality" value={scores.contentQuality} />
        <ScoreCard title="Readability" value={scores.readability} />
        <ScoreCard title="Accessibility" value={scores.accessibility} />
        <ScoreCard title="Performance" value={scores.performance} />
      </div>
      {/* Statistics */}
      <h2 className="text-xl mb-6">Audit Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Word Count" value={stats.wordCount} />
        <StatsCard title="Reading Time" value={stats.readingTime} />
        <StatsCard title="Images" value={stats.images} />
        <StatsCard title="Images Missing ALT" value={stats.imagesMissingAlt} />
        <StatsCard title="Internal Links" value={stats.internalLinks} />
        <StatsCard title="External Links" value={stats.externalLinks} />
        <StatsCard title="Broken Links" value={stats.brokenLinks} />
        <StatsCard title="Meta Title Length" value={stats.metaTitleLength} />
        <StatsCard title="Meta Description Length" value={stats.metaDescriptionLength} />
        <StatsCard title="Headings" value={stats.headings} />
        <StatsCard title="Primary Keyword" value={stats.primaryKeyword} />
        <StatsCard title="Keyword Density" value={stats.keywordDensity} />
      </div>
      {/* Improvement Section */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4">Improvement Suggestions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <h4 className="font-medium mb-2">Previous Content</h4>
            <p className="text-sm">{improvement.previousContent}</p>
          </Card>
          <Card className="p-4">
            <h4 className="font-medium mb-2">Improved Content</h4>
            <p className="text-sm">{improvement.improvedContent}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};



