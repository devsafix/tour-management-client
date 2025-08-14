import Error from "@/components/Error";
import Loading from "@/components/Loading";
import { AddDivisionModal } from "@/components/modules/Admin/Division/AddDivisionModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Division = {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
};

export default function AddDivision() {
  const { data, isLoading, error } = useGetDivisionsQuery(undefined);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error message="Failed to load divisions. Please check your connection." />
    );
  }

  const divisions: Division[] = data || [];

  console.log(divisions);

  const handleDelete = (id: string) => {
    console.log("Delete division with ID:", id);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Divisions</h1>
        <AddDivisionModal />
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {divisions.length > 0 ? (
              divisions.map((item: Division) => (
                <TableRow
                  key={item._id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <Avatar className="w-12 h-12 rounded-md">
                      <AvatarImage src={item.thumbnail} alt={item.name} />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium text-base">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {item.description.slice(0, 75)}...
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-destructive"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-5 w-5" />
                      <span className="sr-only">Delete {item.name}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  No divisions found. Start by adding a new one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
