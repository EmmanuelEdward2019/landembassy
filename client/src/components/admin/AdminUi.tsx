import type { ReactNode } from "react";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import {
  INQUIRY_STATUS_LABELS,
  LISTING_TYPE_LABELS,
  PROPERTY_STATUS_LABELS,
  type InquiryStatus,
  type ListingType,
  type PropertyStatus,
} from "@shared/property";

const PROPERTY_STATUS_STYLES: Record<PropertyStatus, string> = {
  available: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  under_offer: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  sold: "bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  rented: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900",
  leased: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-900",
  off_market: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
};

const INQUIRY_STATUS_STYLES: Record<InquiryStatus, string> = {
  new: "bg-primary/15 text-primary border-primary/30",
  contacted: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900",
  closed: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
};

export function PropertyStatusBadge({ status }: { status: string }) {
  const key = status as PropertyStatus;
  return (
    <Badge variant="outline" className={cn("font-medium whitespace-nowrap", PROPERTY_STATUS_STYLES[key])}>
      {PROPERTY_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export function ListingTypeBadge({ listingType }: { listingType: string }) {
  return (
    <Badge variant="secondary" className="font-medium whitespace-nowrap">
      {LISTING_TYPE_LABELS[listingType as ListingType] ?? listingType}
    </Badge>
  );
}

export function InquiryStatusBadge({ status }: { status: string }) {
  const key = status as InquiryStatus;
  return (
    <Badge variant="outline" className={cn("font-medium whitespace-nowrap", INQUIRY_STATUS_STYLES[key])}>
      {INQUIRY_STATUS_LABELS[key] ?? status}
    </Badge>
  );
}

export function PropertyThumb({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  return src ? (
    <img src={src} alt={alt} loading="lazy" className={cn("object-cover rounded-md bg-muted", className)} />
  ) : (
    <div className={cn("rounded-md bg-muted flex items-center justify-center text-muted-foreground", className)}>
      <Building2 className="h-5 w-5" />
    </div>
  );
}

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  pending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  pending?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={pending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            data-testid="button-confirm-delete"
          >
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
