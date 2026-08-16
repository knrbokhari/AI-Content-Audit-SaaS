/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
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
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { getRecentOrganizations } from "@/services/api";

interface Org {
  name: string;
  plan: string;
  owner: string;
  members: number;
  website: string;
  created: string;
  status: "active" | "pending" | "suspended";
}

const data: Org[] = [
  {
    name: "Acme Corp",
    plan: "Pro",
    owner: "Alice",
    members: 12,
    website: "https://acme.com",
    created: "2024-01-15",
    status: "active",
  },
  {
    name: "Beta Ltd",
    plan: "Basic",
    owner: "Bob",
    members: 5,
    website: "https://beta.com",
    created: "2024-02-10",
    status: "pending",
  },
  {
    name: "Gamma Inc",
    plan: "Enterprise",
    owner: "Carol",
    members: 30,
    website: "https://gamma.com",
    created: "2023-12-01",
    status: "suspended",
  },
];

export function RecentOrganizationsTable() {
  const [result, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRecentOrganizations();
      setData(res);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization Name</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Total Audit</TableHead>
          <TableHead>Website</TableHead>
          <TableHead>Status</TableHead>
          {/* <TableHead>Actions</TableHead> */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {result.map((org: any, idx) => (
          <TableRow key={idx}>
            <TableCell>{org.name}</TableCell>
            <TableCell>{org.subscriptions?.planName || "-"}</TableCell>
            <TableCell>{org.domain}</TableCell>
            <TableCell>{org._count.users}</TableCell>
            <TableCell>{org._count.audits}</TableCell>
            <TableCell>{org.branding?.website || "NA"}</TableCell>
            <TableCell>
              <Badge
                variant={
                  org.subscriptions?.planName === "active"
                    ? "default"
                    : org.status === "pending"
                      ? "secondary"
                      : "destructive"
                }
              >
                {org.subscriptions?.planName || "Free"}
              </Badge>
            </TableCell>
            {/* <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
