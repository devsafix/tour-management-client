/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function HeroSection() {
  const [selectedDivision, setSelectedDivision] = useState<string | undefined>(
    undefined
  );
  const navigate = useNavigate();

  const { data: divisionData, isLoading: divisionLoading } =
    useGetDivisionsQuery(undefined);

  const divisionOptions = divisionData?.map(
    (item: { _id: string; name: string }) => ({
      label: item.name,
      value: item._id,
    })
  );

  const handleSearch = () => {
    if (selectedDivision) {
      navigate(`/tours?division=${selectedDivision}`);
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1606820854416-439b3305ff39?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Banner background of a beautiful landscape in Bangladesh"
          className="w-full h-full object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance mb-4 drop-shadow-md">
            Uncover the Hidden Gems of
            <span className="block text-primary">Bangladesh</span>
          </h1>
          <p className="text-base md:text-xl text-balance max-w-2xl mb-8 drop-shadow-sm">
            Discover breathtaking landscapes, vibrant culture, and unforgettable
            adventures. Your journey through Bangladesh starts here.
          </p>

          <div className="bg-background/80 backdrop-blur-lg p-3 sm:p-4 rounded-full shadow-lg flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            {/* Division Select */}
            <Select
              onValueChange={setSelectedDivision}
              disabled={divisionLoading}
            >
              <SelectTrigger className="w-full sm:w-[250px] bg-white/70">
                <SelectValue placeholder="Select a Division..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Divisions</SelectLabel>
                  {divisionLoading ? (
                    <div className="flex justify-center py-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : (
                    divisionOptions?.map((item: any) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={!selectedDivision}
              className="w-full sm:w-auto h-auto px-6 py-2 rounded-full font-semibold"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Tours
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
