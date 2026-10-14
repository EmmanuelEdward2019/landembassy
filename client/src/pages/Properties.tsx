import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import PropertyCard from "@/components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@shared/schema";
import {
  LISTING_TYPES,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
} from "@shared/property";

import headerImage from "@assets/page-header.jpg";

const LOCATION_KEYWORDS: Record<string, string[]> = {
  lagos: ["lagos"],
  abuja: ["abuja"],
  ph: ["port harcourt", "rivers"],
};

export default function Properties() {
  const initialListing = new URLSearchParams(window.location.search).get("type");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [listingType, setListingType] = useState(
    initialListing && (LISTING_TYPES as readonly string[]).includes(initialListing) ? initialListing : "all",
  );
  const [location, setLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const { data: allProperties = [], isLoading, error, refetch } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allProperties.filter((property) => {
      const matchesSearch =
        query === "" ||
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query);

      const matchesType = propertyType === "all" || property.propertyType === propertyType;
      const matchesListing = listingType === "all" || property.listingType === listingType;

      const matchesLocation =
        location === "all" ||
        LOCATION_KEYWORDS[location].some((keyword) => property.location.toLowerCase().includes(keyword));

      let matchesPrice = true;
      if (priceRange !== "all") {
        const price = property.price;
        if (priceRange === "0-30m") {
          matchesPrice = price < 30000000;
        } else if (priceRange === "30-60m") {
          matchesPrice = price >= 30000000 && price < 60000000;
        } else if (priceRange === "60-100m") {
          matchesPrice = price >= 60000000 && price < 100000000;
        } else if (priceRange === "100m+") {
          matchesPrice = price >= 100000000;
        }
      }

      return matchesSearch && matchesType && matchesListing && matchesLocation && matchesPrice;
    });
  }, [searchQuery, propertyType, listingType, location, priceRange, allProperties]);

  const handleSearch = () => {
    // Search is already live, but this button can be used to reset focus
    document.getElementById("search-input")?.focus();
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Our Properties"
        subtitle="Discover your dream property from our exclusive collection"
        image={headerImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-lg p-6 mb-12 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Search by title or location..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-properties"
                />
              </div>
              <Button onClick={handleSearch} variant="default" data-testid="button-search">
                <Search className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Search</span>
              </Button>
            </div>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger data-testid="select-property-type">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {PROPERTY_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={listingType} onValueChange={setListingType}>
              <SelectTrigger data-testid="select-listing-type">
                <SelectValue placeholder="Buy or Rent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sale, Rent & Lease</SelectItem>
                {LISTING_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {LISTING_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger data-testid="select-location">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="ph">Port Harcourt</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger data-testid="select-price-range">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-30m">Under ₦30M</SelectItem>
                <SelectItem value="30-60m">₦30M - ₦60M</SelectItem>
                <SelectItem value="60-100m">₦60M - ₦100M</SelectItem>
                <SelectItem value="100m+">Above ₦100M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> of{" "}
            <span className="font-semibold text-foreground">{allProperties.length}</span> properties
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[28rem] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold mb-2">Couldn't load properties</h3>
            <p className="text-muted-foreground mb-6">Please check your connection and try again.</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No properties found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search criteria to find what you're looking for
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setPropertyType("all");
                setListingType("all");
                setLocation("all");
                setPriceRange("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
