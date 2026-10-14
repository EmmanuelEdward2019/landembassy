import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ExternalLink, MoreHorizontal, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useDeleteProperty, usePatchProperty, useProperties } from "@/lib/admin-api";
import {
  LISTING_TYPES,
  LISTING_TYPE_LABELS,
  PROPERTY_STATUSES,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  formatPrice,
  type PropertyStatus,
  type PropertyType,
} from "@shared/property";
import type { Property } from "@shared/schema";
import {
  ConfirmDeleteDialog,
  ListingTypeBadge,
  PageTitle,
  PropertyStatusBadge,
  PropertyThumb,
} from "@/components/admin/AdminUi";

function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
  testId,
}: {
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
  testId: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-44" data-testid={testId}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminProperties() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const properties = useProperties();
  const patchProperty = usePatchProperty();
  const deleteProperty = useDeleteProperty();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (properties.data ?? []).filter(
      (p) =>
        (!query || p.title.toLowerCase().includes(query) || p.location.toLowerCase().includes(query)) &&
        (status === "all" || p.status === status) &&
        (listingType === "all" || p.listingType === listingType) &&
        (propertyType === "all" || p.propertyType === propertyType),
    );
  }, [properties.data, search, status, listingType, propertyType]);

  const hasFilters = search || status !== "all" || listingType !== "all" || propertyType !== "all";

  const changeStatus = (property: Property, next: string) => {
    patchProperty.mutate(
      { id: property.id, patch: { status: next as PropertyStatus } },
      {
        onSuccess: () =>
          toast({
            title: "Status updated",
            description: `${property.title} is now ${PROPERTY_STATUS_LABELS[next as PropertyStatus]}.`,
          }),
      },
    );
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { id, title } = pendingDelete;
    deleteProperty.mutate(id, {
      onSuccess: () => toast({ title: "Property deleted", description: `${title} has been removed.` }),
      onSettled: () => setPendingDelete(null),
    });
  };

  return (
    <div>
      <PageTitle
        title="Properties"
        description={properties.data ? `${properties.data.length} listings` : "Manage your listings"}
        actions={
          <Link href="/properties/new">
            <Button data-testid="button-add-property">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
        }
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1 sm:min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search title or location..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search-admin-properties"
            />
          </div>
          <FilterSelect
            value={status}
            onChange={setStatus}
            allLabel="All statuses"
            options={PROPERTY_STATUSES.map((s) => ({ value: s, label: PROPERTY_STATUS_LABELS[s] }))}
            testId="filter-status"
          />
          <FilterSelect
            value={listingType}
            onChange={setListingType}
            allLabel="All listing types"
            options={LISTING_TYPES.map((t) => ({ value: t, label: LISTING_TYPE_LABELS[t] }))}
            testId="filter-listing-type"
          />
          <FilterSelect
            value={propertyType}
            onChange={setPropertyType}
            allLabel="All property types"
            options={PROPERTY_TYPES.map((t) => ({ value: t, label: PROPERTY_TYPE_LABELS[t] }))}
            testId="filter-property-type"
          />
        </div>
      </Card>

      <Card>
        {properties.isLoading ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : properties.error ? (
          <div className="space-y-4 py-12 text-center">
            <p className="text-destructive">{properties.error.message}</p>
            <Button variant="outline" onClick={() => properties.refetch()}>
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="space-y-4 py-16 text-center">
            <p className="text-muted-foreground">
              {hasFilters ? "No properties match these filters" : "No properties yet"}
            </p>
            {hasFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                  setListingType("all");
                  setPropertyType("all");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Link href="/properties/new">
                <Button>Add your first property</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-72">Property</TableHead>
                  <TableHead>Listing</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((property) => (
                  <TableRow key={property.id} data-testid={`row-property-${property.id}`}>
                    <TableCell>
                      <Link href={`/properties/${property.id}`} className="flex items-center gap-3 group">
                        <PropertyThumb src={property.images[0]} alt={property.title} className="h-12 w-16 shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate font-medium group-hover:text-primary">{property.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {PROPERTY_TYPE_LABELS[property.propertyType as PropertyType] ?? property.propertyType} ·{" "}
                            {property.location}
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <ListingTypeBadge listingType={property.listingType} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold tabular-nums">
                      {formatPrice(property.price, property.pricePeriod)}
                    </TableCell>
                    <TableCell>
                      <Select value={property.status} onValueChange={(next) => changeStatus(property, next)}>
                        <SelectTrigger
                          className="h-auto w-auto gap-2 border-0 bg-transparent p-0 shadow-none focus:ring-0"
                          aria-label={`Status of ${property.title}`}
                          data-testid={`select-status-${property.id}`}
                        >
                          <PropertyStatusBadge status={property.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {PROPERTY_STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => patchProperty.mutate({ id: property.id, patch: { featured: !property.featured } })}
                        aria-label={property.featured ? "Remove from featured" : "Mark as featured"}
                        aria-pressed={property.featured}
                        data-testid={`button-featured-${property.id}`}
                      >
                        <Star
                          className={cn(
                            "h-4 w-4",
                            property.featured ? "fill-primary text-primary" : "text-muted-foreground",
                          )}
                        />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Actions for ${property.title}`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => navigate(`/properties/${property.id}`)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={property.status === "off_market"}
                            onSelect={() => window.open(`/properties/${property.id}`, "_blank", "noreferrer")}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on website
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onSelect={() => setPendingDelete(property)}
                            data-testid={`button-delete-property-${property.id}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this property?"
        description={`"${pendingDelete?.title}" will be permanently removed from the dashboard and the website. To hide it temporarily instead, set its status to Off Market.`}
        onConfirm={confirmDelete}
        pending={deleteProperty.isPending}
      />
    </div>
  );
}
