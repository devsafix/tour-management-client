/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Tours/Tours.tsx
import { Button } from "@/components/ui/button";
import { useGetAllToursQuery } from "@/redux/features/tour/tour.api";
import TourFilters from "@/components/modules/Tours/TourFilters";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { MapPin, Users, CalendarDays, BarChart2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";

export default function Tours() {
  const [searchParams] = useSearchParams();

  const division = searchParams.get("division") || undefined;
  const tourType = searchParams.get("tourType") || undefined;

  const { data, isLoading } = useGetAllToursQuery({ division, tourType });

  const tours = data || [];

  return (
    <div className="container mx-auto px-5 py-8 grid grid-cols-12 gap-8">
      <div className="col-span-12 md:col-span-3">
        <TourFilters />
      </div>

      <div className="col-span-12 md:col-span-9 w-full">
        <h1 className="text-3xl font-bold mb-6">Explore Our Tours</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading tours...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="text-center p-10 text-muted-foreground border rounded-lg">
            No tours found matching your criteria.
          </div>
        ) : (
          <div className="grid gap-6">
            {tours.map((item: any) => (
              <Card
                key={item.slug}
                className="overflow-hidden shadow-lg flex flex-col md:flex-row"
              >
                <div className="md:w-2/5 w-full h-64 md:h-auto flex-shrink-0 relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {item.tourType.name}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-1">
                      {item.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="h-4 w-4" />
                      {item.location}, {item.division.name}
                    </p>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-primary">
                      <CalendarDays className="h-4 w-4" />
                      <span className="font-semibold">
                        {item.tourPlan.length} days
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Max {item.maxGuest} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-primary" />
                      <span>Min Age: {item.minAge}+</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.amenities
                      .slice(0, 3)
                      .map((amenity: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-border"
                        >
                          {amenity}
                        </span>
                      ))}
                    {item.amenities.length > 3 && (
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full border border-border">
                        +{item.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                  <CardFooter className="flex justify-between items-center p-0">
                    <div className="text-2xl font-extrabold text-primary">
                      From ৳{item.costFrom.toLocaleString()}
                    </div>
                    <Button asChild>
                      <Link to={`/tours/${item._id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
