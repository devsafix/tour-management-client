/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useGetTourTypesQuery } from "@/redux/features/tour/tour.api";
import { useSearchParams } from "react-router";
import { Loader2, X } from "lucide-react";

export default function TourFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedDivision = searchParams.get("division") || undefined;
  const selectedTourType = searchParams.get("tourType") || undefined;

  const { data: divisionData, isLoading: divisionIsLoading } =
    useGetDivisionsQuery(undefined);

  const { data: tourTypeData, isLoading: tourTypeIsLoading } =
    useGetTourTypesQuery({ limit: 1000, fields: "_id,name" });

  const divisionOptions = divisionData?.map(
    (item: { _id: string; name: string }) => ({
      label: item.name,
      value: item._id,
    })
  );

  const tourTypeOptions = tourTypeData?.data?.map(
    (item: { _id: string; name: string }) => ({
      label: item.name,
      value: item._id,
    })
  );

  const handleDivisionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("division", value);
    setSearchParams(params);
  };

  const handleTourTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tourType", value);
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("division");
    params.delete("tourType");
    setSearchParams(params);
  };

  const isFilterActive = selectedDivision || selectedTourType;

  return (
    <Card className="col-span-12 md:col-span-3 h-fit sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Filters</CardTitle>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleClearFilter}
          disabled={!isFilterActive}
          className="flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear all
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 block text-muted-foreground font-semibold">
            Division to visit
          </Label>
          <Select
            onValueChange={handleDivisionChange}
            value={selectedDivision ?? ""}
            disabled={divisionIsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a division" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Divisions</SelectLabel>
                {divisionOptions?.map((item: any) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
                {divisionIsLoading && (
                  <div className="flex justify-center py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2 block text-muted-foreground font-semibold">
            Tour Type
          </Label>
          <Select
            onValueChange={handleTourTypeChange}
            value={selectedTourType ?? ""}
            disabled={tourTypeIsLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a tour type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tour Types</SelectLabel>
                {tourTypeOptions?.map((item: any) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
                {tourTypeIsLoading && (
                  <div className="flex justify-center py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
