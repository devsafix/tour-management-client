/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useCreateBookingMutation } from "@/redux/features/booking/booking.api";
import { useGetAllToursQuery } from "@/redux/features/tour/tour.api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";
import { Loader2, CalendarDays, Users, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Booking() {
  const [guestsCount, setGuestsCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const { id } = useParams();
  const { data, isLoading, isError } = useGetAllToursQuery({ _id: id });
  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  const tourData = data?.[0];

  console.log(tourData);
  console.log(guestsCount);

  useEffect(() => {
    if (tourData) {
      setTotalAmount(guestsCount * tourData.costFrom);
    }
  }, [guestsCount, tourData]);

  const incrementGuest = () => {
    if (tourData && guestsCount < tourData.maxGuests) {
      setGuestsCount((prv) => prv + 1);
      console.log("first");
    }
  };

  const decrementGuest = () => {
    if (guestsCount > 1) {
      setGuestsCount((prv) => prv - 1);
    }
  };

  const handleBooking = async () => {
    if (!tourData) return;

    try {
      const res = await createBooking({
        tour: id,
        guestsCount: guestsCount,
      }).unwrap();
      if (res.success) {
        toast("Booking Successful");
        window.open(res.data.paymentUrl);
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      toast.error(err.data.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !tourData) {
    return (
      <div className="container mx-auto p-6 text-center text-muted-foreground">
        <h1 className="text-2xl font-bold">Tour not found</h1>
        <p className="mt-2">The tour you are trying to book does not exist.</p>
        <Button asChild className="mt-4">
          <Link to="/tours">Back to Tours</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Section - Tour Summary */}
      <Card className="flex flex-col">
        <div className="relative">
          <img
            src={tourData.images[0]}
            alt={tourData.title}
            className="w-full h-64 object-cover rounded-t-lg"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{tourData.title}</CardTitle>
          <CardDescription>{tourData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>
              {format(new Date(tourData.startDate), "PP")} -{" "}
              {format(new Date(tourData.endDate), "PP")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Max {tourData.maxGuests} guests</span>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Inclusions</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {tourData.included?.map((item: string, index: number) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Tour Plan</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {tourData.tourPlan?.map((plan: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="font-bold mr-2">{`Day ${index + 1}:`}</span>
                  <span>{plan}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Right Section - Booking Details & Form */}
      <Card className="sticky top-20 h-fit">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Confirm Your Booking
          </CardTitle>
          <CardDescription>
            Enter the number of guests to see your total amount.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Number of Guests</label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementGuest}
                disabled={guestsCount <= 1}
                type="button"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-bold w-6 text-center">
                {guestsCount}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementGuest}
                disabled={guestsCount >= tourData.maxGuests}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-sm">
            <span>Price per person</span>
            <span className="font-semibold">
              ৳{tourData.costFrom.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Guests</span>
            <span className="font-semibold">{guestsCount}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-xl font-bold w-full">
            <span>Total Amount</span>
            <span>৳{totalAmount.toLocaleString()}</span>
          </div>
          <Button
            onClick={handleBooking}
            className="w-full"
            size="lg"
            disabled={isBookingLoading}
          >
            {isBookingLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
