// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { Card } from "../ui/card";
// import { KPICard } from "../ui/kpi-card";

// // Types for audit data – these would normally come from a backend API
// interface Audit {
//   overallScore: number;
//   seoScore: number;
//   contentScore: number;
//   readabilityScore: number;
//   accessibilityScore: number;
//   performanceScore: number;
//   wordCount: number;
//   readingTime: string;
//   imageCount: number;
//   imagesWithoutAlt: number;
//   internalLinks: number;
//   externalLinks: number;
//   brokenLinks: number;
//   metaTitleLength: number;
//   metaDescriptionLength: number;
//   headings: any;
//   primaryKeyword: string;
//   keywordDensity: number;
// }

// interface Props {
//   data: Audit;
// }

// const ScoreCard: React.FC<{ title: string; value: number; color?: string }> = ({
//   title,
//   value,
//   color = "#4f46e5",
// }) => (
//   <KPICard
//     title={title}
//     percentage={0}
//     icon={null}
//     value={value}
//     color={color}
//   />
// );

// const StatsCard: React.FC<{ title: string; value: string | number }> = ({
//   title,
//   value,
// }) => (
//   <Card className="p-4">
//     <h4 className="text-sm font-medium text-gray-700">{title}</h4>
//     <p className="mt-2 text-2xl font-bold">{value}</p>
//   </Card>
// );

// export const WebsiteAuditsDetails: React.FC<Props> = ({ data }) => {
//   return (
//     <div className="">
//       <h2 className="text-xl mb-6">Audit Details</h2>
//       {/* Score Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
//         <ScoreCard title="Overall Score" value={data?.overallScore} />
//         <ScoreCard title="SEO" value={data?.seoScore} />
//         <ScoreCard title="Content Quality" value={data?.contentScore} />
//         <ScoreCard title="Readability" value={data?.readabilityScore} />
//         <ScoreCard title="Accessibility" value={data?.accessibilityScore} />
//         <ScoreCard title="Performance" value={data?.performanceScore} />
//       </div>
//       {/* Statistics */}
//       <h2 className="text-xl mb-6">Audit Statistics</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
//         <StatsCard title="Word Count" value={data?.wordCount} />
//         <StatsCard title="Reading Time" value={data?.readingTime} />
//         <StatsCard title="Images" value={data?.imageCount} />
//         <StatsCard title="Images Missing ALT" value={data?.imagesWithoutAlt} />
//         <StatsCard title="Internal Links" value={data?.internalLinks} />
//         <StatsCard title="External Links" value={data?.externalLinks} />
//         <StatsCard title="Broken Links" value={data?.brokenLinks} />
//         <StatsCard title="Meta Title Length" value={data?.metaTitleLength} />
//         <StatsCard
//           title="Meta Description Length"
//           value={data?.metaDescriptionLength}
//         />
//         <StatsCard title="Headings" value={data?.headings?.length} />
//         <StatsCard title="Primary Keyword" value={data?.primaryKeyword} />
//         <StatsCard title="Keyword Density" value={data?.keywordDensity} />
//       </div>
//       {/* Improvement Section */}
//       <div className="mb-8">
//         <h3 className="text-xl font-medium mb-4">Improvement Suggestions</h3>
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Card className="p-4">
//             <h4 className="font-medium mb-2">Previous Content</h4>
//             <p className="text-sm">{improvement.previousContent}</p>
//           </Card>
//           <Card className="p-4">
//             <h4 className="font-medium mb-2">Improved Content</h4>
//             <p className="text-sm">{improvement.improvedContent}</p>
//           </Card>
//         </div> */}
//       </div>
//     </div>
//   );
// };
import React, { useMemo } from "react";
import { Card } from "../ui/card";

/**
 * Types
 * Mirrors the audit record shape returned by the API (see sample JSON).
 */
interface Recommendation {
  id: number;
  auditId: number;
  title: string;
  description: string;
  category: string;
  severity: "high" | "medium" | "low" | string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Metadata {
  robots: string | null;
  ogImage: string | null;
  ogTitle: string | null;
  language: string | null;
  viewport: string | null;
  ogDescription: string | null;
}

interface Headings {
  h1?: string[];
  h2?: string[];
  h3?: string[];
  [key: string]: string[] | undefined;
}

interface Audit {
  id: number;
  url: string;
  title: string;
  description: string;
  summary: string;
  status: string;
  overallScore: number;
  seoScore: number;
  contentScore: number;
  readabilityScore: number;
  accessibilityScore: number;
  performanceScore: number;
  wordCount: number;
  readingTime: number | string;
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  metaTitleLength: number;
  metaDescriptionLength: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  keywordDensity: number;
  primaryKeyword: string;
  headings: Headings;
  metadata: Metadata;
  aiModel?: string;
  createdAt: string;
  updatedAt: string;
  recommendations: Recommendation[];
}

interface Props {
  data: Audit;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

// Score -> semantic color. Kept in one place so every score-driven
// element (ring, bar, badge) agrees on the same thresholds.
function scoreColor(score: number) {
  if (score >= 90) return { stroke: "#16a34a", text: "text-green-600", bg: "bg-green-50", ring: "#16a34a" };
  if (score >= 70) return { stroke: "#2563eb", text: "text-blue-600", bg: "bg-blue-50", ring: "#2563eb" };
  if (score >= 50) return { stroke: "#d97706", text: "text-amber-600", bg: "bg-amber-50", ring: "#d97706" };
  return { stroke: "#dc2626", text: "text-red-600", bg: "bg-red-50", ring: "#dc2626" };
}

function scoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs work";
  return "Critical";
}

const severityStyles: Record<string, { badge: string; border: string; dot: string }> = {
  high: { badge: "bg-red-100 text-red-700", border: "border-l-red-500", dot: "bg-red-500" },
  medium: { badge: "bg-amber-100 text-amber-700", border: "border-l-amber-500", dot: "bg-amber-500" },
  low: { badge: "bg-slate-100 text-slate-600", border: "border-l-slate-400", dot: "bg-slate-400" },
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ------------------------------------------------------------------ */
/* Small presentational pieces                                        */
/* ------------------------------------------------------------------ */

const ScoreRing: React.FC<{ title: string; value: number; size?: number; big?: boolean }> = ({
  title,
  value,
  size = 88,
  big = false,
}) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const { stroke, text, bg } = scoreColor(safeValue);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  return (
    <Card className="p-5 flex flex-col items-center text-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={8}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${big ? "text-2xl" : "text-lg"} ${text}`}>
            {safeValue}
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}>
          {scoreLabel(safeValue)}
        </span>
      </div>
    </Card>
  );
};

const StatsCard: React.FC<{ title: string; value: string | number; hint?: string }> = ({
  title,
  value,
  hint,
}) => (
  <Card className="p-4">
    <h4 className="text-xs font-medium uppercase tracking-wide text-gray-500">{title}</h4>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
  </Card>
);

const MetaCheck: React.FC<{ label: string; value: string | null | undefined }> = ({
  label,
  value,
}) => {
  const ok = Boolean(value && value.trim().length > 0);
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500 truncate max-w-xs">
          {ok ? value : "Missing"}
        </p>
      </div>
      <span
        className={`shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${
          ok ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
        aria-label={ok ? "Present" : "Missing"}
      >
        {ok ? "✓" : "!"}
      </span>
    </div>
  );
};

const HeadingBar: React.FC<{ label: string; count: number; max: number }> = ({
  label,
  count,
  max,
}) => (
  <div className="flex items-center gap-3">
    <span className="w-6 text-xs font-semibold text-gray-500">{label}</span>
    <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full bg-indigo-500"
        style={{ width: `${max > 0 ? Math.max((count / max) * 100, count > 0 ? 6 : 0) : 0}%` }}
      />
    </div>
    <span className="w-6 text-xs text-gray-500 text-right">{count}</span>
  </div>
);

const RecommendationItem: React.FC<{ rec: Recommendation }> = ({ rec }) => {
  const style = severityStyles[rec.severity] ?? severityStyles.low;
  return (
    <Card className={`p-4 border-l-4 ${style.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{rec.title}</h4>
          </div>
          <p className="text-sm text-gray-600">{rec.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${style.badge}`}>
            {rec.severity}
          </span>
          <span className="text-xs text-gray-400 capitalize">{rec.category}</span>
        </div>
      </div>
      {rec.isResolved && (
        <p className="mt-2 text-xs font-medium text-green-600">Resolved</p>
      )}
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export const WebsiteAuditsDetails: React.FC<Props> = ({ data }) => {
  const sortedRecommendations = useMemo(() => {
    const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return [...(data?.recommendations ?? [])].sort(
      (a, b) => (order[a.severity] ?? 3) - (order[b.severity] ?? 3)
    );
  }, [data?.recommendations]);

  const unresolvedCount = data?.recommendations?.filter((r) => !r.isResolved).length ?? 0;
  const maxHeading = Math.max(data?.h1Count ?? 0, data?.h2Count ?? 0, data?.h3Count ?? 0, 1);

  if (!data) return null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{data.title}</h2>
            <a
              href={data.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-600 hover:underline break-all"
            >
              {data.url}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
              {data.status}
            </span>
            <span className="text-xs text-gray-400">
              Audited {formatDate(data.createdAt)}
            </span>
          </div>
        </div>
        {data.description && (
          <p className="text-sm text-gray-600 max-w-3xl">{data.description}</p>
        )}
      </div>

      {/* AI Summary */}
      {data.summary && (
        <Card className="p-5 bg-indigo-50/50 border-indigo-100">
          <h3 className="text-sm font-semibold text-indigo-700 mb-2">Summary</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
        </Card>
      )}

      {/* Score Rings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Scores</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ScoreRing title="Overall" value={data.overallScore} size={104} big />
          <ScoreRing title="SEO" value={data.seoScore} />
          <ScoreRing title="Content" value={data.contentScore} />
          <ScoreRing title="Readability" value={data.readabilityScore} />
          <ScoreRing title="Accessibility" value={data.accessibilityScore} />
          <ScoreRing title="Performance" value={data.performanceScore} />
        </div>
        {data.performanceScore === 0 && (
          <p className="mt-3 text-xs text-gray-400">
            Performance data unavailable for this audit.
          </p>
        )}
      </div>

      {/* Statistics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content &amp; Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <StatsCard title="Word Count" value={data.wordCount} />
          <StatsCard title="Reading Time" value={`${data.readingTime} min`} />
          <StatsCard title="Images" value={data.imageCount} />
          <StatsCard
            title="Missing Alt Text"
            value={data.imagesWithoutAlt}
            hint={
              data.imageCount
                ? `${Math.round((data.imagesWithoutAlt / data.imageCount) * 100)}% of images`
                : undefined
            }
          />
          <StatsCard title="Internal Links" value={data.internalLinks} />
          <StatsCard title="External Links" value={data.externalLinks} />
          <StatsCard title="Broken Links" value={data.brokenLinks} />
          <StatsCard title="Keyword Density" value={`${data.keywordDensity}%`} />
          <StatsCard title="Primary Keyword" value={data.primaryKeyword} />
          <StatsCard
            title="Meta Title Length"
            value={`${data.metaTitleLength} chars`}
            hint={data.metaTitleLength < 30 || data.metaTitleLength > 60 ? "Outside 30–60 range" : "Good length"}
          />
          <StatsCard
            title="Meta Description Length"
            value={`${data.metaDescriptionLength} chars`}
            hint={data.metaDescriptionLength > 160 ? "Longer than 160 chars" : "Good length"}
          />
        </div>
      </div>

      {/* Headings + Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Heading Structure</h3>
          <div className="space-y-3">
            <HeadingBar label="H1" count={data.h1Count} max={maxHeading} />
            <HeadingBar label="H2" count={data.h2Count} max={maxHeading} />
            <HeadingBar label="H3" count={data.h3Count} max={maxHeading} />
          </div>
          {data.h1Count > 1 && (
            <p className="mt-3 text-xs text-amber-600">
              Multiple H1 tags found — pages usually work best with exactly one.
            </p>
          )}
          {(data.headings?.h1?.length ?? 0) > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">H1 text</p>
              <ul className="space-y-1">
                {data.headings.h1!.map((text, i) => (
                  <li key={i} className="text-sm text-gray-700 truncate">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Metadata</h3>
          <p className="text-xs text-gray-400 mb-2">
            Viewport: {data.metadata?.viewport ?? "not set"} · Language:{" "}
            {data.metadata?.language ?? "not set"}
          </p>
          <div>
            <MetaCheck label="Robots tag" value={data.metadata?.robots} />
            <MetaCheck label="Open Graph title" value={data.metadata?.ogTitle} />
            <MetaCheck label="Open Graph description" value={data.metadata?.ogDescription} />
            <MetaCheck label="Open Graph image" value={data.metadata?.ogImage} />
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Improvement Suggestions</h3>
          {unresolvedCount > 0 && (
            <span className="text-xs font-medium text-gray-500">
              {unresolvedCount} open
            </span>
          )}
        </div>
        {sortedRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedRecommendations.map((rec) => (
              <RecommendationItem key={rec.id} rec={rec} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center text-sm text-gray-500">
            No recommendations for this audit.
          </Card>
        )}
      </div>
    </div>
  );
};

export default WebsiteAuditsDetails;