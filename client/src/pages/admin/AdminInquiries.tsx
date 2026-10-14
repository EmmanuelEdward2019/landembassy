import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Eye, Mail, MessageCircle, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  useContacts,
  useDeleteInquiry,
  useQuotes,
  useUpdateInquiryStatus,
  type InquiryKind,
} from "@/lib/admin-api";
import { INQUIRY_STATUSES, INQUIRY_STATUS_LABELS, type InquiryStatus } from "@shared/property";
import type { Contact, Quote } from "@shared/schema";
import { ConfirmDeleteDialog, InquiryStatusBadge, PageTitle } from "@/components/admin/AdminUi";

type Inquiry = (Quote | Contact) & Partial<Pick<Quote, "propertyInterest" | "budgetRange" | "preferredContact">>;

// Nigerian numbers are often typed as 0XXXXXXXXXX; wa.me needs the international form
function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
}

function ContactLinks({ inquiry }: { inquiry: Inquiry }) {
  return (
    <div className="space-y-1 text-sm">
      <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 hover:text-primary">
        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
        {inquiry.email}
      </a>
      {inquiry.phone && (
        <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 hover:text-primary">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          {inquiry.phone}
        </a>
      )}
    </div>
  );
}

export default function AdminInquiries({ kind }: { kind: InquiryKind }) {
  const { toast } = useToast();
  const quotes = useQuotes();
  const contacts = useContacts();
  const query = kind === "quotes" ? quotes : contacts;
  const updateStatus = useUpdateInquiryStatus(kind);
  const deleteInquiry = useDeleteInquiry(kind);

  const [statusFilter, setStatusFilter] = useState<"all" | InquiryStatus>("all");
  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Inquiry | null>(null);

  const items = (query.data ?? []) as Inquiry[];
  const filtered = useMemo(
    () => items.filter((i) => statusFilter === "all" || i.status === statusFilter),
    [items, statusFilter],
  );
  const countFor = (status: InquiryStatus) => items.filter((i) => i.status === status).length;

  const isQuotes = kind === "quotes";
  const noun = isQuotes ? "quote request" : "message";

  const setStatus = (inquiry: Inquiry, status: InquiryStatus) => updateStatus.mutate({ id: inquiry.id, status });

  // Opening a new inquiry marks it as read
  const view = (inquiry: Inquiry) => {
    setViewing(inquiry);
    if (inquiry.status === "new") setStatus(inquiry, "contacted");
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteInquiry.mutate(pendingDelete.id, {
      onSuccess: () => toast({ title: "Deleted", description: `The ${noun} has been deleted.` }),
      onSettled: () => setPendingDelete(null),
    });
  };

  return (
    <div>
      <PageTitle
        title={isQuotes ? "Quote Requests" : "Messages"}
        description={isQuotes ? "Requests from the Get a Quote form" : "Messages from the Contact form"}
      />

      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)} className="mb-4">
        <TabsList>
          <TabsTrigger value="all">All ({items.length})</TabsTrigger>
          {INQUIRY_STATUSES.map((status) => (
            <TabsTrigger key={status} value={status}>
              {INQUIRY_STATUS_LABELS[status]} ({countFor(status)})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        {query.isLoading ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : query.error ? (
          <div className="space-y-4 py-12 text-center">
            <p className="text-destructive">{query.error.message}</p>
            <Button variant="outline" onClick={() => query.refetch()}>
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            {items.length === 0 ? `No ${noun}s yet` : `No ${noun}s with this status`}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Received</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  {isQuotes && <TableHead>Interest</TableHead>}
                  <TableHead className="min-w-56">Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inquiry) => (
                  <TableRow key={inquiry.id} className={inquiry.status === "new" ? "bg-primary/5" : undefined}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(inquiry.createdAt), "d MMM yyyy")}
                      <br />
                      {format(new Date(inquiry.createdAt), "h:mm a")}
                    </TableCell>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>
                      <ContactLinks inquiry={inquiry} />
                    </TableCell>
                    {isQuotes && (
                      <TableCell className="text-sm">
                        <p>{inquiry.propertyInterest}</p>
                        <p className="text-muted-foreground">{inquiry.budgetRange}</p>
                      </TableCell>
                    )}
                    <TableCell className="max-w-xs">
                      <button
                        type="button"
                        onClick={() => view(inquiry)}
                        className="line-clamp-2 text-left text-sm hover:text-primary"
                      >
                        {inquiry.message}
                      </button>
                    </TableCell>
                    <TableCell>
                      <Select value={inquiry.status} onValueChange={(v) => setStatus(inquiry, v as InquiryStatus)}>
                        <SelectTrigger
                          className="h-auto w-auto gap-2 border-0 bg-transparent p-0 shadow-none focus:ring-0"
                          aria-label={`Status of ${noun} from ${inquiry.name}`}
                        >
                          <InquiryStatusBadge status={inquiry.status} />
                        </SelectTrigger>
                        <SelectContent>
                          {INQUIRY_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {INQUIRY_STATUS_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => view(inquiry)} aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPendingDelete(inquiry)}
                          aria-label="Delete"
                          data-testid={`button-delete-${kind}-${inquiry.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.name}</DialogTitle>
                <DialogDescription>
                  {isQuotes ? "Quote request" : "Message"} · {format(new Date(viewing.createdAt), "d MMM yyyy, h:mm a")}
                </DialogDescription>
              </DialogHeader>
              <ContactLinks inquiry={viewing} />
              {isQuotes && (
                <dl className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Interested in</dt>
                    <dd className="font-medium">{viewing.propertyInterest}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Budget</dt>
                    <dd className="font-medium">{viewing.budgetRange}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Prefers</dt>
                    <dd className="font-medium capitalize">{viewing.preferredContact}</dd>
                  </div>
                </dl>
              )}
              <p className="max-h-[40vh] overflow-y-auto whitespace-pre-wrap break-words">{viewing.message}</p>
              <div className="flex flex-wrap gap-2 border-t pt-4">
                <a href={`mailto:${viewing.email}?subject=${encodeURIComponent("Re: your enquiry to Land Embassy")}`}>
                  <Button size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Reply by Email
                  </Button>
                </a>
                {viewing.phone && (
                  <a href={`https://wa.me/${whatsappNumber(viewing.phone)}`} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto"
                  onClick={() => {
                    setStatus(viewing, "closed");
                    setViewing(null);
                  }}
                >
                  Mark as Closed
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title={`Delete this ${noun}?`}
        description={`The ${noun} from ${pendingDelete?.name} will be permanently deleted.`}
        onConfirm={confirmDelete}
        pending={deleteInquiry.isPending}
      />
    </div>
  );
}
