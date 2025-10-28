import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Quote, Contact } from "@shared/schema";

export default function EmbassyAdmin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const correctToken = "LANDEMBASSY2024ADMIN";

  const { data: quotes = [], isLoading: quotesLoading } = useQuery<Quote[]>({
    queryKey: ["/api/quotes"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/quotes", {
        headers: {
          Authorization: `Bearer ${correctToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch quotes");
      return res.json();
    },
  });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/contacts", {
        headers: {
          Authorization: `Bearer ${correctToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${correctToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete quote");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      toast({
        title: "Quote Deleted",
        description: "Quote has been successfully deleted.",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${correctToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete contact");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Contact Deleted",
        description: "Contact has been successfully deleted.",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === correctToken) {
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["/api/quotes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Access Granted",
        description: "Welcome to Embassy Admin Dashboard",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid authentication token",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
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
                placeholder="Enter token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                data-testid="input-admin-token"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-admin-login">
              Access Dashboard
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Embassy Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all form submissions and inquiries</p>
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
                {quotesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
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
                            <TableCell className="max-w-xs truncate">{quote.message}</TableCell>
                            <TableCell>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => deleteQuoteMutation.mutate(quote.id)}
                                data-testid={`button-delete-quote-${quote.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
                {contactsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
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
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => deleteContactMutation.mutate(contact.id)}
                                data-testid={`button-delete-contact-${contact.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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
    </div>
  );
}
