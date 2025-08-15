/* eslint-disable @typescript-eslint/no-explicit-any */

import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import {
  useAddTourMutation,
  useGetTourTypesQuery,
} from "@/redux/features/tour/tour.api";
import type { IErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// --- MultiColumn Component for better layout ---
const MultiColumn = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
    {children}
  </div>
);

// --- Zod schema remains the same ---
const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    costFrom: z.string().min(1, "Cost is required"),
    startDate: z.date({ message: "Start date is required" }),
    endDate: z.date({ message: "End date is required" }),
    departureLocation: z.string().min(1, "Departure location is required"),
    arrivalLocation: z.string().min(1, "Arrival location is required"),
    included: z.array(z.object({ value: z.string() })),
    excluded: z.array(z.object({ value: z.string() })),
    amenities: z.array(z.object({ value: z.string() })),
    tourPlan: z.array(z.object({ value: z.string() })),
    maxGuests: z.string().min(1, "Max guest is required"),
    minAge: z.string().min(1, "Minimum age is required"),
    division: z.string().min(1, "Division is required"),
    tourType: z.string().min(1, "Tour type is required"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date cannot be before start date.",
    path: ["endDate"],
  });

// --- Reorganized AddTour component ---
export default function AddTour() {
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);

  const { data: divisionData, isLoading: divisionLoading } =
    useGetDivisionsQuery(undefined);
  const { data: tourTypeData } = useGetTourTypesQuery(undefined);
  const [addTour] = useAddTourMutation();

  const divisionOptions = divisionData?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    })
  );

  const tourTypeOptions = tourTypeData?.data?.map(
    (tourType: { _id: string; name: string }) => ({
      value: tourType._id,
      label: tourType.name,
    })
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "Cox's Bazar Beach Adventure",
      description:
        "Experience the world's longest natural sea beach with golden sandy shores, crystal clear waters, and breathtaking sunsets. Enjoy beach activities, local seafood, and explore nearby attractions including Himchari National Park and Inani Beach.",
      location: "Cox's Bazar",
      costFrom: "15000",
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
      departureLocation: "Dhaka",
      arrivalLocation: "Cox's Bazar",
      included: [{ value: "Accommodation for 2 nights" }],
      excluded: [{ value: "Personal expenses" }],
      amenities: [{ value: "Air-conditioned rooms" }],
      tourPlan: [{ value: "Day 1: Arrival and beach exploration" }],
      maxGuests: "25",
      minAge: "5",
      division: "",
      tourType: "",
    },
  });

  const {
    fields: includedFields,
    append: appendIncluded,
    remove: removeIncluded,
  } = useFieldArray({
    control: form.control,
    name: "included",
  });

  const {
    fields: excludedFields,
    append: appendExcluded,
    remove: removeExcluded,
  } = useFieldArray({
    control: form.control,
    name: "excluded",
  });

  const {
    fields: amenitiesFields,
    append: appendAmenities,
    remove: removeAmenities,
  } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const {
    fields: tourPlanFields,
    append: appendTourPlan,
    remove: removeTourPlan,
  } = useFieldArray({
    control: form.control,
    name: "tourPlan",
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Creating tour....");

    if (images.length === 0) {
      toast.error("Please add some images", { id: toastId });
      return;
    }

    // Custom validation for included, excluded, amenities, and tourPlan fields
    const hasIncludedErrors = data.included.some(
      (item) => item.value.trim() === ""
    );
    const hasExcludedErrors = data.excluded.some(
      (item) => item.value.trim() === ""
    );
    const hasAmenitiesErrors = data.amenities.some(
      (item) => item.value.trim() === ""
    );
    const hasTourPlanErrors = data.tourPlan.some(
      (item) => item.value.trim() === ""
    );

    if (
      hasIncludedErrors ||
      hasExcludedErrors ||
      hasAmenitiesErrors ||
      hasTourPlanErrors
    ) {
      toast.error("Please fill in all dynamic fields or remove them.", {
        id: toastId,
      });
      return;
    }

    const tourData = {
      ...data,
      costFrom: Number(data.costFrom),
      minAge: Number(data.minAge),
      maxGuests: Number(data.maxGuests),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included: data.included.map((item: { value: string }) => item.value),
      excluded: data.excluded.map((item: { value: string }) => item.value),
      amenities: data.amenities.map((item: { value: string }) => item.value),
      tourPlan: data.tourPlan.map((item: { value: string }) => item.value),
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => formData.append("files", image as File));

    try {
      const res = await addTour(formData).unwrap();

      if (res.success) {
        toast.success("Tour created", { id: toastId });
        form.reset();
        setImages([]); // Clear images after successful submission
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error((err as IErrorResponse).message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-5 mt-16">
      <Form {...form}>
        <form
          id="add-tour-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Tour Details</CardTitle>
              <CardDescription>
                Provide the main information about the tour.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Cox's Bazar Beach Adventure"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <MultiColumn>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Cox's Bazar" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost (Per Person)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g., 15000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MultiColumn>

              <MultiColumn>
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Dhaka" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Cox's Bazar" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MultiColumn>

              <MultiColumn>
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={divisionLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a division" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionOptions?.map((item: any) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tourType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tour Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tour type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tourTypeOptions?.map((option: any) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MultiColumn>

              <MultiColumn>
                <FormField
                  control={form.control}
                  name="maxGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Guest</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="e.g., 25"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="e.g., 5" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MultiColumn>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule & Description</CardTitle>
              <CardDescription>
                Define the dates, description, and images for the tour.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiColumn>
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < form.getValues("startDate") ||
                              date <
                                new Date(
                                  new Date().setDate(new Date().getDate() - 1)
                                )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </MultiColumn>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Provide a detailed description of the tour."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Tour Images</FormLabel>
                <FormControl>
                  <MultipleImageUploader onChange={setImages} />
                </FormControl>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tour Plan & Details</CardTitle>
              <CardDescription>
                Add the included, excluded, amenities, and daily tour plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <MultiColumn>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Included</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => appendIncluded({ value: "" })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {includedFields.map((item, index) => (
                      <div className="flex gap-2 items-center" key={item.id}>
                        <FormField
                          control={form.control}
                          name={`included.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1 m-0">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeIncluded(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Excluded</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => appendExcluded({ value: "" })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {excludedFields.map((item, index) => (
                      <div className="flex gap-2 items-center" key={item.id}>
                        <FormField
                          control={form.control}
                          name={`excluded.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1 m-0">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeExcluded(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </MultiColumn>

              <MultiColumn>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Amenities</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => appendAmenities({ value: "" })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {amenitiesFields.map((item, index) => (
                      <div className="flex gap-2 items-center" key={item.id}>
                        <FormField
                          control={form.control}
                          name={`amenities.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1 m-0">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeAmenities(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">Tour Plan</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => appendTourPlan({ value: "" })}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {tourPlanFields.map((item, index) => (
                      <div className="flex gap-2 items-center" key={item.id}>
                        <FormField
                          control={form.control}
                          name={`tourPlan.${index}.value`}
                          render={({ field }) => (
                            <FormItem className="flex-1 m-0">
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          onClick={() => removeTourPlan(index)}
                          variant="destructive"
                          size="icon"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </MultiColumn>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end p-0">
            <Button
              type="submit"
              form="add-tour-form"
              className="w-full md:w-auto"
            >
              Create Tour
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}
