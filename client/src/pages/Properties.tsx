import { useState } from "react";
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
import headerImage from "@assets/crop for header_1761621717723.jpg";

export default function Properties() {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [location, setLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  // TODO: Remove mock data
  const properties = [
    {
      id: "1",
      title: "Luxury 5 Bedroom Duplex",
      price: "85,000,000",
      location: "Banana Island, Lagos",
      bedrooms: 5,
      bathrooms: 6,
      area: 450,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      type: "Luxury",
    },
    {
      id: "2",
      title: "Modern 3 Bedroom Apartment",
      price: "32,000,000",
      location: "Victoria Island, Lagos",
      bedrooms: 3,
      bathrooms: 4,
      area: 220,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      type: "Residential",
    },
    {
      id: "3",
      title: "Commercial Plaza",
      price: "250,000,000",
      location: "Central Business District, Abuja",
      bedrooms: 0,
      bathrooms: 8,
      area: 1200,
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      type: "Commercial",
    },
    {
      id: "4",
      title: "4 Bedroom Terrace",
      price: "55,000,000",
      location: "Lekki Phase 1, Lagos",
      bedrooms: 4,
      bathrooms: 5,
      area: 320,
      image: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800",
      type: "Residential",
    },
    {
      id: "5",
      title: "Prime Land",
      price: "120,000,000",
      location: "Ikoyi, Lagos",
      bedrooms: 0,
      bathrooms: 0,
      area: 2500,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      type: "Land",
    },
    {
      id: "6",
      title: "Executive 6 Bedroom Mansion",
      price: "180,000,000",
      location: "Asokoro, Abuja",
      bedrooms: 6,
      bathrooms: 7,
      area: 650,
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      type: "Luxury",
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Our Properties"
        subtitle="Discover your dream property from our exclusive collection"
        image={headerImage}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-lg p-6 mb-12 border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search properties..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-properties"
                />
              </div>
            </div>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger data-testid="select-property-type">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
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
            Showing <span className="font-semibold text-foreground">{properties.length}</span> properties
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </div>
  );
}
