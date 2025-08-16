/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddTourTypeModal } from "@/components/modules/Admin/TourType/AddTourModal";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetTourTypesQuery,
  useRemoveTourTypeMutation,
} from "@/redux/features/tour/tour.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AddTourType() {
  const [currentPage, setCurrentPage] = useState(1);

  const [removeTourType] = useRemoveTourTypeMutation();
  const { data, isLoading, error } = useGetTourTypesQuery({
    page: currentPage,
  });

  const handleRemoveTourType = async (tourId: string) => {
    const toastId = toast.loading("Removing...");
    try {
      const res = await removeTourType(tourId).unwrap();
      if (res.success) {
        toast.success("Removed", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  const totalPage = data?.meta?.totalPage || 1;

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error message="Failed to load tour types. Please check your connection." />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Tour Types</h1>
        <AddTourTypeModal />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2">Tour Type</TableHead>
              <TableHead className="text-right w-1/2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.length > 0 ? (
              data.data.map((item: { name: string; _id: string }) => (
                <TableRow
                  key={item._id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium text-base">
                    {item?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteConfirmation
                      onConfirm={() => handleRemoveTourType(item._id)}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Delete {item?.name}</span>
                      </Button>
                    </DeleteConfirmation>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center py-8 text-muted-foreground"
                >
                  No tour types found. Start by adding a new one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPage > 1 && (
        <div className="flex justify-end mt-4">
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPage }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => setCurrentPage(page)}
                    >
                      <PaginationLink isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={
                      currentPage === totalPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
