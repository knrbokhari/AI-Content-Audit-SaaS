/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getRoles, deleteRole } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Card } from "../ui/card";

interface Role {
  id: number | string;
  name: string;
  isSystem: boolean;
}

export const RoleList = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await getRoles();
      setRoles(data?.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRoles();
  }, []);

  const handleEdit = (id: number | string) => {
    router.push(`/role/${id}/edit`);
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;

    try {
      setIsDeleting(true);
      await deleteRole(selectedRole.id);
      toast.success("Role deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedRole(null);
      // Refresh roles list
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <Card className="!p-4">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SL</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Is System</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No roles found
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role, index) => (
              <TableRow key={role.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{role.name}</TableCell>
                <TableCell>
                  {role.isSystem ? (
                    <span className="text-green-600 font-medium">Yes</span>
                  ) : (
                    <span className="text-gray-600">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(role.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(role)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role &ldquo;
              {selectedRole?.name}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
