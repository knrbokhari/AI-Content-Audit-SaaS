/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "../ui/spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getWebsiteAudits } from "@/services/api";
import { Button } from "../ui/button";
import formatDate from "@/utils/formatDate";
import { TableSkeleton } from "../ui/skeleton";

interface Audit {
  organization: string;
  website: string;
  auditScore: number;
  aiScore: number;
  created: string;
}

const data: Audit[] = [
  {
    organization: "Acme Corp",
    website: "https://acme.com",
    auditScore: 92,
    aiScore: 88,
    created: "2024-03-10",
  },
  {
    organization: "Beta Ltd",
    website: "https://beta.com",
    auditScore: 78,
    aiScore: 80,
    created: "2024-03-08",
  },
  {
    organization: "Gamma Inc",
    website: "https://gamma.com",
    auditScore: 85,
    aiScore: 90,
    created: "2024-03-05",
  },
];

export function WebsiteAuditsList() {
  const [audits, setAudits] = useState<any[]>([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const fetchWebsiteAudits = async () => {
    try {
      setLoading(true);
      const res = await getWebsiteAudits({ page, size: 10 });
      const { data, ...rest } = res;
      setAudits(data);
      setPagination(rest);
    } catch (error) {
      console.error("Error fetching Audits:", error);
      toast.error("Failed to fetch Audits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebsiteAudits();
  }, []);

  const handleView = (id: number | string) => {
    router.push(`/website-audits/${id}/details`);
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center py-10">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website</TableHead>
              <TableHead>Audit Score</TableHead>
              <TableHead>Content Score</TableHead>
              <TableHead>SEO Score</TableHead>
              <TableHead>Created Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableSkeleton items={3} cell={6} />}
            {audits?.map((a, idx) => (
              <TableRow key={idx}>
                <TableCell>{a.url}</TableCell>
                <TableCell>{a.overallScore}</TableCell>
                <TableCell>{a.contentScore}</TableCell>
                <TableCell>{a.seoScore}</TableCell>
                <TableCell>{formatDate(a.createdAt)}</TableCell>
                <TableCell>
                  <Button onClick={() => handleView(a.id)}>View Report</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
