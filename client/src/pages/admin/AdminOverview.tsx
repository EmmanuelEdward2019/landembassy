import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Building2, CheckCircle2, FileText, Handshake, Mail, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContacts, useProperties, useQuotes } from "@/lib/admin-api";
import {
  CLOSED_STATUSES,
  LISTING_TYPES,
  LISTING_TYPE_LABELS,
  PROPERTY_STATUSES,
  formatPrice,
  formatPriceShort,
  type PropertyStatus,
} from "@shared/property";
import {
  InquiryStatusBadge,
  PageTitle,
  PropertyStatusBadge,
  PropertyThumb,
} from "@/components/admin/AdminUi";

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof Building2;
  loading?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
          )}
          {hint && <p className="mt-1 text-xs text-muted-foreground truncate">{hint}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </Card>
  );
}

export default function AdminOverview() {
  const properties = useProperties();
  const quotes = useQuotes();
  const contacts = useContacts();

  const list = properties.data ?? [];
  const available = list.filter((p) => p.status === "available");
  const closed = list.filter((p) => CLOSED_STATUSES.includes(p.status as PropertyStatus));
  const forSaleValue = available.filter((p) => p.listingType === "sale").reduce((sum, p) => sum + p.price, 0);

  const inquiries = [
    ...(quotes.data ?? []).map((q) => ({ ...q, kind: "Quote request", href: "/quotes" })),
    ...(contacts.data ?? []).map((c) => ({ ...c, kind: "Message", href: "/messages" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const recentlyUpdated = [...list]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const statusCounts = PROPERTY_STATUSES.map((status) => ({
    status,
    count: list.filter((p) => p.status === status).length,
  })).filter((s) => s.count > 0);

  const typeCounts = LISTING_TYPES.map((type) => ({
    type,
    count: list.filter((p) => p.listingType === type).length,
  })).filter((t) => t.count > 0);

  const inquiriesLoading = quotes.isLoading || contacts.isLoading;

  return (
    <div>
      <PageTitle
        title="Overview"
        description="Your listings and inquiries at a glance"
        actions={
          <Link href="/properties/new">
            <Button data-testid="button-add-property">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </Link>
        }
      />

      {(properties.error || quotes.error || contacts.error) && (
        <Card className="mb-6 border-destructive/50 p-4 text-sm text-destructive">
          {(properties.error ?? quotes.error ?? contacts.error)?.message}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Total Listings"
          value={list.length}
          hint={`${list.filter((p) => p.featured).length} featured`}
          icon={Building2}
          loading={properties.isLoading}
        />
        <StatTile
          label="Available"
          value={available.length}
          hint={forSaleValue ? `${formatPriceShort(forSaleValue)} for sale` : undefined}
          icon={CheckCircle2}
          loading={properties.isLoading}
        />
        <StatTile
          label="Sold / Let"
          value={closed.length}
          hint="Sold, rented or leased"
          icon={Handshake}
          loading={properties.isLoading}
        />
        <StatTile
          label="New Inquiries"
          value={newInquiries}
          hint={`${inquiries.length} total`}
          icon={Mail}
          loading={inquiriesLoading}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent Inquiries</h2>
            <Link href="/quotes" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          {inquiriesLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No inquiries yet</p>
          ) : (
            <ul className="divide-y">
              {inquiries.slice(0, 6).map((inquiry) => (
                <li key={`${inquiry.kind}-${inquiry.id}`}>
                  <Link
                    href={inquiry.href}
                    className="flex items-center gap-3 py-3 hover:bg-muted/50 -mx-2 px-2 rounded-md"
                  >
                    <div className="rounded-full bg-muted p-2">
                      {inquiry.kind === "Message" ? <Mail className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{inquiry.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {inquiry.kind} · {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <InquiryStatusBadge status={inquiry.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Listings by Status</h2>
          {properties.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <ul className="space-y-2">
                {statusCounts.map(({ status, count }) => (
                  <li key={status} className="flex items-center justify-between">
                    <PropertyStatusBadge status={status} />
                    <span className="font-semibold tabular-nums">{count}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 mt-6 border-t pt-4 text-sm font-semibold">By Listing Type</h3>
              <ul className="space-y-2 text-sm">
                {typeCounts.map(({ type, count }) => (
                  <li key={type} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{LISTING_TYPE_LABELS[type]}</span>
                    <span className="font-semibold tabular-nums">{count}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recently Updated Listings</h2>
          <Link href="/properties" className="flex items-center text-sm text-primary hover:underline">
            Manage properties <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        {properties.isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <ul className="divide-y">
            {recentlyUpdated.map((property) => (
              <li key={property.id}>
                <Link
                  href={`/properties/${property.id}`}
                  className="flex items-center gap-4 py-3 hover:bg-muted/50 -mx-2 px-2 rounded-md"
                >
                  <PropertyThumb src={property.images[0]} alt={property.title} className="h-12 w-16 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{property.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{property.location}</p>
                  </div>
                  <span className="hidden text-sm font-semibold sm:block">
                    {formatPrice(property.price, property.pricePeriod)}
                  </span>
                  <PropertyStatusBadge status={property.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
