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
import { getPermissions, deletePermission } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Card } from "../ui/card";
import formatDate from "@/utils/formatDate";

interface Permission {
  id: number | string;
  role: {
    name: string;
  };
  resource: {
    name: string;
  };
  action: string;
  createdAt: string;
}

export const PermissionList = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      const data = await getPermissions();
      setPermissions(data?.data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleEdit = (id: number | string) => {
    router.push(`/permission/${id}/edit`);
  };

  const handleDeleteClick = (permission: Permission) => {
    setSelectedPermission(permission);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPermission) return;

    try {
      setIsDeleting(true);
      await deletePermission(selectedPermission.id);
      toast.success("Permission deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedPermission(null);
      // Refresh Permission list
      fetchPermissions();
    } catch (error) {
      console.error("Error deleting permission:", error);
      toast.error("Failed to delete permission");
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
              <TableHead>Role</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No permissions found
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item?.role?.name}</TableCell>
                  <TableCell>{item?.resource?.name}</TableCell>
                  <TableCell>{item?.action}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(item)}
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
              Are you sure you want to delete this Permission? This action
              cannot be undone.
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
