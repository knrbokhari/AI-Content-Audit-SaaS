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
import { getResources, deleteResource } from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Card } from "../ui/card";
import formatDate from "@/utils/formatDate";
import Pagination from "../ui/pagination";
import { TableSkeleton } from "../ui/skeleton";

export interface Resource {
  id: number | string;
  name: string;
  slug: string;
  createdAt: string;
}

export const ResourceList = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [paginatorInfo, setPagination] = useState<{
    total: number;
    currentPage: number;
    perPage: number;
  } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await getResources({ page, limit: 10 });
      const { data, total, currentPage, perPage } = res;
      setResources(data);
      setPagination({ total, currentPage, perPage });
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [page]);

  const handleEdit = (id: number | string) => {
    router.push(`/resource/${id}/edit`);
  };

  const handleDeleteClick = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResource) return;

    try {
      setIsDeleting(true);
      await deleteResource(selectedResource.id);
      toast.success("Resource deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedResource(null);
      // Refresh roles list
      fetchResources();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    } finally {
      setIsDeleting(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center py-10">
  //       <LoadingSpinner />
  //     </div>
  //   );
  // }

  function onPagination(current: number) {
    setPage(current);
  }

  return (
    <div>
      <Card className="!p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SL</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableSkeleton items={10} cell={5} />}

            {resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              resources.map((role, index) => (
                <TableRow key={role.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.slug}</TableCell>
                  <TableCell>{formatDate(role.createdAt)}</TableCell>
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

        {!!paginatorInfo?.total && (
          <div className="flex items-center justify-end">
            <Pagination
              total={paginatorInfo.total}
              current={paginatorInfo.currentPage}
              pageSize={paginatorInfo.perPage}
              onChange={onPagination}
              showLessItems
            />
          </div>
        )}
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the role &ldquo;
              {selectedResource?.name}&rdquo;? This action cannot be undone.
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
