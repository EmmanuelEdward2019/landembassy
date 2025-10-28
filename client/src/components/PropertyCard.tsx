import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square } from "lucide-react";
import { Link } from "wouter";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  type: string;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  image,
  type,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-property-${id}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
          {type}
        </Badge>
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-md">
          <span className="font-bold text-primary text-lg">₦{price}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-2 line-clamp-1" data-testid={`text-property-title-${id}`}>
          {title}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4 text-muted-foreground" />
            <span>{area} sqm</span>
          </div>
        </div>
        <Link href={`/properties/${id}`}>
          <Button variant="outline" className="w-full" data-testid={`button-view-details-${id}`}>
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
}
