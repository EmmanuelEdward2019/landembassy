import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, Building2 } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import {
  LISTING_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
  formatPrice,
  type ListingType,
  type PropertyStatus,
  type PropertyType,
} from "@shared/property";

export default function PropertyCard({ property }: { property: Property }) {
  const { id, title, location, bedrooms, bathrooms, area, images, status } = property;
  const isUnavailable = status !== "available";

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-property-${id}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {images[0] ? (
          <img
            src={images[0]}
            alt={title}
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Building2 className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <Badge className="bg-primary text-primary-foreground">
            {LISTING_TYPE_LABELS[property.listingType as ListingType] ?? property.listingType}
          </Badge>
          <Badge variant="secondary">
            {PROPERTY_TYPE_LABELS[property.propertyType as PropertyType] ?? property.propertyType}
          </Badge>
        </div>
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-md">
          <span className="font-bold text-primary text-lg">{formatPrice(property.price, property.pricePeriod)}</span>
        </div>
        {isUnavailable && (
          <div className="absolute inset-x-0 bottom-0 bg-black/75 py-2 text-center text-sm font-semibold uppercase tracking-wide text-white">
            {PROPERTY_STATUS_LABELS[status as PropertyStatus] ?? status}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-xl mb-2 line-clamp-1" data-testid={`text-property-title-${id}`}>
          {title}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-4 mb-4 text-sm">
          {bedrooms > 0 && (
            <div className="flex items-center gap-1" title="Bedrooms">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{bedrooms}</span>
            </div>
          )}
          {bathrooms > 0 && (
            <div className="flex items-center gap-1" title="Bathrooms">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{bathrooms}</span>
            </div>
          )}
          {area > 0 && (
            <div className="flex items-center gap-1" title="Area">
              <Square className="h-4 w-4 text-muted-foreground" />
              <span>{area.toLocaleString()} sqm</span>
            </div>
          )}
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
