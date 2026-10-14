import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PropertyCard from "@/components/PropertyCard";
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

const PHONE = "+2349011072155";
const WHATSAPP = "2349011072155";
const EMAIL = "info@landembassy.com";

function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-6 w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 aspect-[16/10] w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const id = params?.id ?? "";
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", id],
    enabled: Boolean(id),
  });
  const { data: allProperties = [] } = useQuery<Property[]>({ queryKey: ["/api/properties"] });

  if (isLoading) return <DetailSkeleton />;

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Property not found</h1>
        <p className="text-muted-foreground mb-8">
          This listing may have been sold, let, or removed. Browse our other available properties.
        </p>
        <Link href="/properties">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            View All Properties
          </Button>
        </Link>
      </div>
    );
  }

  // Same property type first, then same listing type; never the current one
  const similarProperties = allProperties
    .filter((p) => p.id !== property.id)
    .sort(
      (a, b) =>
        Number(b.propertyType === property.propertyType) - Number(a.propertyType === property.propertyType) ||
        Number(b.listingType === property.listingType) - Number(a.listingType === property.listingType),
    )
    .slice(0, 3);

  const images = property.images;
  const activeImage = images[Math.min(currentImageIndex, images.length - 1)];
  const price = formatPrice(property.price, property.pricePeriod);
  const listingLabel = LISTING_TYPE_LABELS[property.listingType as ListingType] ?? property.listingType;
  const statusLabel = PROPERTY_STATUS_LABELS[property.status as PropertyStatus] ?? property.status;
  const typeLabel = PROPERTY_TYPE_LABELS[property.propertyType as PropertyType] ?? property.propertyType;

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const enquiry = `Hello Land Embassy, I'm interested in "${property.title}" (${property.location}, ${price}).\n${pageUrl}`;
  const viewingRequest = `Hello Land Embassy, I'd like to schedule a viewing of "${property.title}" (${property.location}).\n${pageUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: property.title, url: pageUrl });
        return;
      } catch {
        // Cancelled or unsupported: fall back to copying the link
      }
    }
    await navigator.clipboard.writeText(pageUrl);
    toast({
      title: "Link Copied!",
      description: "Property link has been copied to clipboard.",
    });
  };

  const details = [
    property.bedrooms > 0 && { icon: Bed, value: property.bedrooms, label: "Bedrooms" },
    property.bathrooms > 0 && { icon: Bath, value: property.bathrooms, label: "Bathrooms" },
    property.area > 0 && { icon: Square, value: property.area.toLocaleString(), label: "Sqm" },
    { icon: Calendar, value: statusLabel, label: "Status" },
  ].filter(Boolean) as { icon: typeof Bed; value: string | number; label: string }[];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className="bg-primary text-primary-foreground">{listingLabel}</Badge>
                <Badge variant="secondary">{typeLabel}</Badge>
                {property.status !== "available" && <Badge variant="outline">{statusLabel}</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={handleShare} aria-label="Share" data-testid="button-share">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-muted">
                {activeImage ? (
                  <img src={activeImage} alt={property.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <Building2 className="h-16 w-16" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden hover-elevate ${
                        currentImageIndex === index ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                {details.map((detail) => (
                  <div key={detail.label} className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <detail.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className={typeof detail.value === "number" ? "text-2xl font-bold" : "text-lg font-bold"}>
                        {detail.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{detail.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              {property.description && (
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-lg mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}
            </Card>

            {property.features.length > 0 && (
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Features & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">{listingLabel}</p>
                <p className="text-3xl font-bold text-primary">{price}</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(viewingRequest)}`} target="_blank" rel="noreferrer">
                  <Button className="w-full" size="lg" data-testid="button-schedule-viewing">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule Viewing
                  </Button>
                </a>
                <a href={`tel:${PHONE}`}>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Agent
                  </Button>
                </a>
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(enquiry)}`} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </Button>
                </a>
                <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Enquiry: ${property.title}`)}&body=${encodeURIComponent(enquiry)}`}>
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Agent
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>

        {similarProperties.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
