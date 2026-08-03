import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";

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
  { name: "Acme Corp", plan: "Pro", owner: "Alice", members: 12, website: "https://acme.com", created: "2024-01-15", status: "active" },
  { name: "Beta Ltd", plan: "Basic", owner: "Bob", members: 5, website: "https://beta.com", created: "2024-02-10", status: "pending" },
  { name: "Gamma Inc", plan: "Enterprise", owner: "Carol", members: 30, website: "https://gamma.com", created: "2023-12-01", status: "suspended" },
];

export function RecentOrganizationsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Organization Name</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Website</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((org, idx) => (
          <TableRow key={idx}>
            <TableCell>{org.name}</TableCell>
            <TableCell>{org.plan}</TableCell>
            <TableCell>{org.owner}</TableCell>
            <TableCell>{org.members}</TableCell>
            <TableCell>{org.website}</TableCell>
            <TableCell>{org.created}</TableCell>
            <TableCell>
              <Badge variant={org.status === "active" ? "default" : org.status === "pending" ? "secondary" : "destructive"}>
                {org.status}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
