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
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Website</TableHead>
              <TableHead>Audit Score</TableHead>
              <TableHead>issues</TableHead>
              <TableHead>AI Score</TableHead>
              <TableHead>Created Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((a, idx) => (
              <TableRow key={idx}>
                <TableCell>{a.website}</TableCell>
                <TableCell>{a.auditScore}</TableCell>
                <TableCell>{a.auditScore}</TableCell>
                <TableCell>{a.aiScore}</TableCell>
                <TableCell>{a.created}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>View Report</DropdownMenuItem>
                      <DropdownMenuItem>Re‑audit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
