import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Trash2, Mail, Phone, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Quote, Contact } from "@shared/schema";

// The token is only ever typed in by the admin and verified by the server.
// sessionStorage keeps it for this tab only; it is cleared when the tab closes.
const TOKEN_KEY = "embassy-admin-token";

function readStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string | null) {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Storage unavailable (e.g. private mode): the session just won't survive a refresh
  }
}

class UnauthorizedError extends Error {}

async function adminFetch(url: string, token: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new UnauthorizedError("Your session is no longer valid");
  if (res.status === 429) throw new Error("Too many attempts. Please wait a few minutes.");
  if (res.status === 503) throw new Error("Admin access is not configured on the server");
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res;
}

type PendingDelete = { kind: "quote" | "contact"; id: string; name: string };
type ViewedMessage = { name: string; email: string; message: string };

export default function EmbassyAdmin() {
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [tokenInput, setTokenInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [viewedMessage, setViewedMessage] = useState<ViewedMessage | null>(null);

  const logout = () => {
    storeToken(null);
    setToken(null);
    queryClient.removeQueries({ queryKey: ["/api/quotes"] });
    queryClient.removeQueries({ queryKey: ["/api/contacts"] });
  };

  const handleError = (error: Error) => {
    if (error instanceof UnauthorizedError) logout();
    toast({ title: "Error", description: error.message, variant: "destructive" });
  };

  const quotesQuery = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
    enabled: Boolean(token),
    queryFn: async () => (await adminFetch("/api/quotes", token!)).json(),
  });

  const contactsQuery = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
    enabled: Boolean(token),
    queryFn: async () => (await adminFetch("/api/contacts", token!)).json(),
  });

  // A rotated or wrong stored token sends the admin back to the login form
  const queryError = quotesQuery.error ?? contactsQuery.error;
  useEffect(() => {
    if (queryError instanceof UnauthorizedError) logout();
  }, [queryError]);

  const deleteMutation = useMutation({
    mutationFn: async ({ kind, id }: PendingDelete) => {
      await adminFetch(`/api/${kind}s/${encodeURIComponent(id)}`, token!, { method: "DELETE" });
    },
    onSuccess: (_data, { kind }) => {
      queryClient.invalidateQueries({ queryKey: [`/api/${kind}s`] });
      toast({
        title: kind === "quote" ? "Quote Deleted" : "Contact Deleted",
        description: `The ${kind} has been successfully deleted.`,
      });
    },
    onError: handleError,
    onSettled: () => setPendingDelete(null),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = tokenInput.trim();
    setIsLoggingIn(true);
    try {
      await adminFetch("/api/admin/session", candidate);
      storeToken(candidate);
      setToken(candidate);
      setTokenInput("");
      toast({
        title: "Access Granted",
        description: "Welcome to Embassy Admin Dashboard",
      });
    } catch (error) {
      toast({
        title: "Access Denied",
        description: error instanceof UnauthorizedError ? "Invalid authentication token" : (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Embassy Admin</h1>
            <p className="text-muted-foreground">Enter your access token to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Access Token</label>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="Enter token"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                required
                data-testid="input-admin-token"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn} data-testid="button-admin-login">
              {isLoggingIn ? "Checking..." : "Access Dashboard"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const quotes = quotesQuery.data ?? [];
  const contacts = contactsQuery.data ?? [];

  const errorRow = (error: Error | null, retry: () => void) =>
    error ? (
      <div className="text-center py-8 space-y-4">
        <p className="text-destructive">{error.message}</p>
        <Button variant="outline" onClick={retry}>Try again</Button>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Embassy Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all form submissions and inquiries</p>
          </div>
          <Button variant="outline" onClick={logout} data-testid="button-admin-logout">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>

        <Tabs defaultValue="quotes" className="space-y-6">
          <TabsList>
            <TabsTrigger value="quotes" data-testid="tab-quotes">
              Quote Requests ({quotes.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              Contact Messages ({contacts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Quote Requests</h2>
                {quotesQuery.isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : quotesQuery.error ? (
                  errorRow(quotesQuery.error, () => quotesQuery.refetch())
                ) : quotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No quote requests yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Property Interest</TableHead>
                          <TableHead>Budget Range</TableHead>
                          <TableHead>Preferred</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quotes.map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">{quote.name}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3 w-3" />
                                  {quote.email}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3" />
                                  {quote.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{quote.propertyInterest}</TableCell>
                            <TableCell>{quote.budgetRange}</TableCell>
                            <TableCell className="capitalize">{quote.preferredContact}</TableCell>
                            <TableCell className="max-w-xs truncate">{quote.message}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  aria-label="View message"
                                  onClick={() => setViewedMessage(quote)}
                                  data-testid={`button-view-quote-${quote.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  aria-label="Delete quote"
                                  onClick={() => setPendingDelete({ kind: "quote", id: quote.id, name: quote.name })}
                                  data-testid={`button-delete-quote-${quote.id}`}
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
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
                {contactsQuery.isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : contactsQuery.error ? (
                  errorRow(contactsQuery.error, () => contactsQuery.refetch())
                ) : contacts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No contact messages yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3 w-3" />
                                  {contact.email}
                                </div>
                                {contact.phone && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-3 w-3" />
                                    {contact.phone}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">{contact.message}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  aria-label="View message"
                                  onClick={() => setViewedMessage(contact)}
                                  data-testid={`button-view-contact-${contact.id}`}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  aria-label="Delete contact"
                                  onClick={() => setPendingDelete({ kind: "contact", id: contact.id, name: contact.name })}
                                  data-testid={`button-delete-contact-${contact.id}`}
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
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={viewedMessage !== null} onOpenChange={(open) => !open && setViewedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message from {viewedMessage?.name}</DialogTitle>
            <DialogDescription>{viewedMessage?.email}</DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto">{viewedMessage?.message}</p>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {pendingDelete?.kind}?</AlertDialogTitle>
            <AlertDialogDescription>
              The submission from {pendingDelete?.name} will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (pendingDelete) deleteMutation.mutate(pendingDelete);
              }}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
