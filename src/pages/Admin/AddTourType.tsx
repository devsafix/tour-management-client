import { AddTourTypeModal } from "@/components/Admin/TourType/AddTourModal";
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
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { Trash2 } from "lucide-react";

export default function AddTourType() {
  const { data, isLoading, error } = useGetTourTypesQuery(undefined);

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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Delete {item?.name}</span>
                    </Button>
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
    </div>
  );
}
