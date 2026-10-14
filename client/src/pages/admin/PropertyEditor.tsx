import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, ImagePlus, Link2, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  adminKeys,
  uploadImage,
  useAdminErrorHandler,
  useAdminQuery,
  useAdminSession,
  useDeleteProperty,
  useSaveProperty,
} from "@/lib/admin-api";
import {
  LISTING_TYPES,
  LISTING_TYPE_LABELS,
  PRICE_PERIODS,
  PRICE_PERIOD_LABELS,
  PROPERTY_STATUSES,
  PROPERTY_STATUS_LABELS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_LABELS,
  formatPrice,
  type ListingType,
  type PricePeriod,
  type PropertyStatus,
  type PropertyType,
} from "@shared/property";
import type { Property } from "@shared/schema";
import { ConfirmDeleteDialog, PageTitle } from "@/components/admin/AdminUi";

type FormState = {
  title: string;
  description: string;
  listingType: ListingType;
  status: PropertyStatus;
  propertyType: PropertyType;
  price: string;
  pricePeriod: PricePeriod;
  location: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  images: string[];
  features: string[];
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  listingType: "sale",
  status: "available",
  propertyType: "residential",
  price: "",
  pricePeriod: "year",
  location: "",
  bedrooms: "0",
  bathrooms: "0",
  area: "0",
  images: [],
  features: [],
  featured: false,
};

const SUGGESTED_FEATURES = [
  "24/7 Security",
  "Swimming Pool",
  "Fitted Kitchen",
  "BQ Accommodation",
  "Ample Parking",
  "Generator",
  "Air Conditioning",
  "Gym",
  "Garden",
  "Gated Estate",
  "Water Treatment",
  "Smart Home Features",
  "C of O",
  "Governor's Consent",
];

function toForm(property: Property): FormState {
  return {
    title: property.title,
    description: property.description,
    listingType: property.listingType as ListingType,
    status: property.status as PropertyStatus,
    propertyType: property.propertyType as PropertyType,
    price: String(property.price),
    pricePeriod: (property.pricePeriod as PricePeriod) ?? "year",
    location: property.location,
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    area: String(property.area),
    images: property.images,
    features: property.features,
    featured: property.featured,
  };
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </Card>
  );
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function EnumSelect<T extends string>({
  id,
  value,
  onChange,
  options,
  labels,
}: {
  id: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly T[];
  labels: Record<T, string>;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger id={id} data-testid={`select-${id}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {labels[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ImageManager({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const { token, uploadsEnabled } = useAdminSession();
  const onError = useAdminErrorHandler();
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [urlInput, setUrlInput] = useState("");
  // Uploads finish asynchronously; always append to the latest list
  const latest = useRef(images);
  latest.current = images;

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setUploading((n) => n + selected.length);
    for (const file of selected) {
      try {
        const url = await uploadImage(file, token);
        onChange([...latest.current, url]);
      } catch (error) {
        onError(error as Error);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const addUrl = () => {
    const url = urlInput.trim();
    if (!/^https:\/\//.test(url)) {
      onError(new Error("Image links must start with https://"));
      return;
    }
    onChange([...images, url]);
    setUrlInput("");
  };

  const move = (from: number, to: number) => {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative overflow-hidden rounded-lg border bg-muted">
              <img src={url} alt={`Property image ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                  Cover
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-black/70 to-transparent p-2">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    disabled={index === 0}
                    onClick={() => move(index, index - 1)}
                    aria-label="Move image earlier"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-7 w-7"
                    disabled={index === images.length - 1}
                    onClick={() => move(index, index + 1)}
                    aria-label="Move image later"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7"
                  onClick={() => onChange(images.filter((_, i) => i !== index))}
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
          {uploading > 0 &&
            Array.from({ length: uploading }).map((_, i) => (
              <div key={`uploading-${i}`} className="flex aspect-[4/3] items-center justify-center rounded-lg border bg-muted">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ))}
        </div>
      )}

      {images.length === 0 && uploading === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center text-muted-foreground">
          <ImagePlus className="mb-2 h-8 w-8" />
          <p className="text-sm">No images yet. The first image is used as the cover photo.</p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!uploadsEnabled || uploading > 0}
          onClick={() => fileInput.current?.click()}
          data-testid="button-upload-images"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Images
        </Button>
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Or paste an image link (https://...)"
              className="pl-9"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              data-testid="input-image-url"
            />
          </div>
          <Button type="button" variant="secondary" onClick={addUrl} disabled={!urlInput.trim()}>
            Add
          </Button>
        </div>
      </div>
      {!uploadsEnabled && (
        <p className="text-xs text-muted-foreground">
          Image uploads are off until Vercel Blob is connected to the project. You can still add images by link.
        </p>
      )}
    </div>
  );
}

function FeaturesEditor({ features, onChange }: { features: string[]; onChange: (features: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = (feature: string) => {
    const value = feature.trim();
    if (value && !features.some((f) => f.toLowerCase() === value.toLowerCase())) {
      onChange([...features, value]);
    }
    setInput("");
  };
  const suggestions = SUGGESTED_FEATURES.filter((s) => !features.includes(s));

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a feature, e.g. Swimming Pool"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(input);
            }
          }}
          data-testid="input-feature"
        />
        <Button type="button" variant="secondary" onClick={() => add(input)} disabled={!input.trim()}>
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </div>
      {features.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <span key={feature} className="inline-flex items-center gap-1 rounded-full bg-primary/15 py-1 pl-3 pr-1 text-sm">
              {feature}
              <button
                type="button"
                onClick={() => onChange(features.filter((f) => f !== feature))}
                className="rounded-full p-0.5 hover:bg-primary/20"
                aria-label={`Remove ${feature}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      {suggestions.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => add(s)}
                className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PropertyEditor({ id }: { id?: string }) {
  const isNew = !id;
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const existing = useAdminQuery<Property>(adminKeys.property(id ?? "new"), `/api/admin/properties/${id}`, !isNew);
  const save = useSaveProperty();
  const deleteProperty = useDeleteProperty();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fill the form once the property loads (and not again, so edits aren't overwritten)
  useEffect(() => {
    if (existing.data && loadedId !== existing.data.id) {
      setForm(toForm(existing.data));
      setLoadedId(existing.data.id);
    }
  }, [existing.data, loadedId]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      ...form,
      price: Number(form.price),
      pricePeriod: form.listingType === "sale" ? null : form.pricePeriod,
      bedrooms: Number(form.bedrooms || 0),
      bathrooms: Number(form.bathrooms || 0),
      area: Number(form.area || 0),
    };
    save.mutate(
      { id, input },
      {
        onSuccess: (property) => {
          toast({
            title: isNew ? "Property added" : "Changes saved",
            description: `${property.title} has been ${isNew ? "added" : "updated"}.`,
          });
          navigate("/properties");
        },
      },
    );
  };

  if (!isNew && existing.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!isNew && existing.error) {
    return (
      <div className="space-y-4 py-20 text-center">
        <p className="text-destructive">{existing.error.message}</p>
        <Link href="/properties">
          <Button variant="outline">Back to properties</Button>
        </Link>
      </div>
    );
  }

  const priceNumber = Number(form.price);
  const showPeriod = form.listingType !== "sale";

  return (
    <form onSubmit={handleSubmit}>
      <Link href="/properties" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-1 h-4 w-4" />
        All properties
      </Link>
      <PageTitle
        title={isNew ? "Add Property" : "Edit Property"}
        description={isNew ? "Create a new listing" : form.title}
        actions={
          <>
            {!isNew && (
              <Button type="button" variant="outline" onClick={() => setConfirmDelete(true)} data-testid="button-delete-property">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button type="submit" disabled={save.isPending} data-testid="button-save-property">
              {save.isPending ? "Saving..." : isNew ? "Add Property" : "Save Changes"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Section title="Basic Information">
            <Field label="Title" htmlFor="title">
              <Input
                id="title"
                required
                minLength={3}
                maxLength={160}
                placeholder="e.g. Luxury 5 Bedroom Duplex"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                data-testid="input-title"
              />
            </Field>
            <Field label="Location" htmlFor="location" hint="Area and city, e.g. Lekki Phase 1, Lagos">
              <Input
                id="location"
                required
                minLength={2}
                maxLength={200}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                data-testid="input-location"
              />
            </Field>
            <Field label="Description" htmlFor="description">
              <Textarea
                id="description"
                rows={6}
                maxLength={10000}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                data-testid="input-description"
              />
            </Field>
          </Section>

          <Section title="Images" description="Use the arrows to reorder. The first image is the cover photo on the website.">
            <ImageManager images={form.images} onChange={(images) => set("images", images)} />
          </Section>

          <Section title="Features & Amenities">
            <FeaturesEditor features={form.features} onChange={(features) => set("features", features)} />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Listing">
            <Field label="Listing type" htmlFor="listingType">
              <EnumSelect
                id="listingType"
                value={form.listingType}
                onChange={(v) => set("listingType", v)}
                options={LISTING_TYPES}
                labels={LISTING_TYPE_LABELS}
              />
            </Field>
            <Field label="Status" htmlFor="status" hint="Off Market hides the listing from the website.">
              <EnumSelect
                id="status"
                value={form.status}
                onChange={(v) => set("status", v)}
                options={PROPERTY_STATUSES}
                labels={PROPERTY_STATUS_LABELS}
              />
            </Field>
            <Field
              label="Price (₦)"
              htmlFor="price"
              hint={priceNumber > 0 ? formatPrice(priceNumber, showPeriod ? form.pricePeriod : null) : undefined}
            >
              <Input
                id="price"
                type="number"
                inputMode="numeric"
                required
                min={0}
                step="any"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                data-testid="input-price"
              />
            </Field>
            {showPeriod && (
              <Field label="Price period" htmlFor="pricePeriod">
                <EnumSelect
                  id="pricePeriod"
                  value={form.pricePeriod}
                  onChange={(v) => set("pricePeriod", v)}
                  options={PRICE_PERIODS}
                  labels={PRICE_PERIOD_LABELS}
                />
              </Field>
            )}
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <div>
                <Label htmlFor="featured">Featured</Label>
                <p className="text-xs text-muted-foreground">Shown on the home page</p>
              </div>
              <Switch
                id="featured"
                checked={form.featured}
                onCheckedChange={(checked) => set("featured", checked)}
                data-testid="switch-featured"
              />
            </div>
          </Section>

          <Section title="Details">
            <Field label="Property type" htmlFor="propertyType">
              <EnumSelect
                id="propertyType"
                value={form.propertyType}
                onChange={(v) => set("propertyType", v)}
                options={PROPERTY_TYPES}
                labels={PROPERTY_TYPE_LABELS}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Bedrooms" htmlFor="bedrooms">
                <Input
                  id="bedrooms"
                  type="number"
                  min={0}
                  max={100}
                  value={form.bedrooms}
                  onChange={(e) => set("bedrooms", e.target.value)}
                  data-testid="input-bedrooms"
                />
              </Field>
              <Field label="Bathrooms" htmlFor="bathrooms">
                <Input
                  id="bathrooms"
                  type="number"
                  min={0}
                  max={100}
                  value={form.bathrooms}
                  onChange={(e) => set("bathrooms", e.target.value)}
                  data-testid="input-bathrooms"
                />
              </Field>
            </div>
            <Field label="Area (sqm)" htmlFor="area">
              <Input
                id="area"
                type="number"
                min={0}
                value={form.area}
                onChange={(e) => set("area", e.target.value)}
                data-testid="input-area"
              />
            </Field>
          </Section>
        </div>
      </div>

      {!isNew && (
        <ConfirmDeleteDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title="Delete this property?"
          description={`"${form.title}" will be permanently removed from the dashboard and the website. To hide it temporarily instead, set its status to Off Market.`}
          pending={deleteProperty.isPending}
          onConfirm={() =>
            deleteProperty.mutate(id!, {
              onSuccess: () => {
                toast({ title: "Property deleted", description: `${form.title} has been removed.` });
                navigate("/properties");
              },
              onSettled: () => setConfirmDelete(false),
            })
          }
        />
      )}
    </form>
  );
}
