// src/components/modules/Tours/TourDetails.tsx
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { useGetAllToursQuery } from "@/redux/features/tour/tour.api";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Users,
  CalendarDays,
  DollarSign,
  Info,
  Check,
  X,
  List,
  Loader2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TourDetails() {
  const { id } = useParams();
  const { data, isLoading: toursLoading } = useGetAllToursQuery({ _id: id });
  const tourData = data?.[0];

  const { data: divisionData, isLoading: divisionLoading } =
    useGetDivisionsQuery(
      {
        _id: tourData?.division,
        fields: "name",
      },
      {
        skip: !tourData,
      }
    );

  if (toursLoading || divisionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tourData) {
    return (
      <div className="container mx-auto p-6 text-center text-muted-foreground">
        <h1 className="text-2xl font-bold">Tour not found</h1>
        <p className="mt-2">The tour you are looking for does not exist.</p>
        <Button asChild className="mt-4">
          <Link to="/tours">Back to Tours</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Main Title and Booking Section */}
          <div className="bg-background rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h1 className="text-4xl font-extrabold mb-4">
                  {tourData.title}
                </h1>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {tourData.location}, {divisionData?.[0]?.name}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  ৳{tourData.costFrom.toLocaleString()}
                </span>
                <Button size="lg" asChild>
                  <Link to={`/booking/${tourData._id}`}>Book Now</Link>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">{tourData.description}</p>
          </div>

          {/* Image Gallery */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Image Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tourData.images?.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${tourData.title} image ${index + 1}`}
                    className="w-full h-56 object-cover rounded-md transition-transform hover:scale-105"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tour Plan */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Tour Plan</CardTitle>
              <CardDescription>
                A day-by-day breakdown of your adventure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-s border-gray-200 dark:border-gray-700 space-y-8">
                {tourData.tourPlan?.map((plan: string, index: number) => (
                  <li key={index} className="ms-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-primary rounded-full -start-3 ring-8 ring-background">
                      <List className="w-3 h-3 text-primary-foreground" />
                    </span>
                    <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                      Day {index + 1}
                    </h3>
                    <p className="text-base font-normal text-muted-foreground">
                      {plan}
                    </p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with quick facts and inclusions */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Tour Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CalendarDays className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Duration</h4>
                    <p className="text-muted-foreground text-sm">
                      {tourData.tourPlan.length} days
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Price per person</h4>
                    <p className="text-muted-foreground text-sm">
                      From ৳{tourData.costFrom.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Max Guests</h4>
                    <p className="text-muted-foreground text-sm">
                      {tourData.maxGuest} people
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Info className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">Minimum Age</h4>
                    <p className="text-muted-foreground text-sm">
                      {tourData.minAge}+
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    What's Included
                  </h3>
                  <ul className="space-y-1">
                    {tourData.included?.map((item: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-green-600"
                      >
                        <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    What's Excluded
                  </h3>
                  <ul className="space-y-1">
                    {tourData.excluded?.map((item: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-red-600"
                      >
                        <X className="w-4 h-4 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {tourData.amenities?.map(
                      (amenity: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-border"
                        >
                          {amenity}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
