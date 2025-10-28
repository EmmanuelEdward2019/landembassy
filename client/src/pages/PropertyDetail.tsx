import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Share2,
  Heart,
  Phone,
  Mail,
  MessageCircle,
  Home,
  Car,
  Wifi,
  Shield,
  TreePine,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PropertyCard from "@/components/PropertyCard";

export default function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // TODO: Remove mock data - fetch from API using params.id
  const property = {
    id: params?.id || "1",
    title: "Luxury 5 Bedroom Duplex with Pool",
    price: "85,000,000",
    location: "Banana Island, Lagos",
    bedrooms: 5,
    bathrooms: 6,
    area: 450,
    type: "Luxury",
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200",
    ],
    description:
      "This stunning luxury duplex offers the perfect blend of modern elegance and comfortable living. Located in the prestigious Banana Island, this property features spacious rooms, high-end finishes, and breathtaking views. The open-concept design creates a seamless flow between living spaces, perfect for both entertaining and family life.",
    features: [
      "Swimming Pool",
      "24/7 Security",
      "Fitted Kitchen",
      "BQ Accommodation",
      "Ample Parking",
      "Generator",
      "Air Conditioning",
      "Garden",
      "Gym",
      "Smart Home Features",
    ],
    amenities: [
      { icon: Home, label: "Spacious Living Areas" },
      { icon: Car, label: "3 Car Garage" },
      { icon: Wifi, label: "High-Speed Internet" },
      { icon: Shield, label: "Gated Community" },
      { icon: TreePine, label: "Landscaped Gardens" },
    ],
  };

  const relatedProperties = [
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Property link has been copied to clipboard.",
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "Property removed from your favorites"
        : "Property added to your favorites",
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                data-testid="button-share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleFavorite}
                data-testid="button-favorite"
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  {property.type}
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-[4/3] rounded-lg overflow-hidden hover-elevate ${
                      currentImageIndex === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Bath className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Square className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.area}</p>
                    <p className="text-sm text-muted-foreground">Sqm</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{property.status}</p>
                    <p className="text-sm text-muted-foreground">Status</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Price</p>
                <p className="text-3xl font-bold text-primary">₦{property.price}</p>
              </div>
              <div className="space-y-3">
                <Button className="w-full" size="lg" data-testid="button-schedule-viewing">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Viewing
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Agent
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Agent
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProperties.map((prop) => (
              <PropertyCard key={prop.id} {...prop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
