import { useState } from "react";
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

export default function EmbassyAdmin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const correctToken = "LANDEMBASSY2024ADMIN";

  // TODO: Replace with API calls
  const quoteSubmissions = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 901 234 5678",
      propertyType: "Residential",
      location: "Lagos",
      budget: "₦50,000,000",
      message: "Looking for a 3-bedroom apartment in Lekki",
      date: "2024-10-28",
      status: "New",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 802 345 6789",
      propertyType: "Commercial",
      location: "Abuja",
      budget: "₦200,000,000",
      message: "Need office space for tech startup",
      date: "2024-10-27",
      status: "Reviewed",
    },
  ];

  const contactSubmissions = [
    {
      id: "1",
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+234 803 456 7890",
      message: "I would like to schedule a property viewing",
      date: "2024-10-28",
      status: "New",
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+234 901 567 8901",
      message: "Interested in your consultancy services",
      date: "2024-10-27",
      status: "Responded",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === correctToken) {
      setIsAuthenticated(true);
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
              Quote Requests ({quoteSubmissions.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">
              Contact Messages ({contactSubmissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Quote Requests</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Property Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quoteSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {submission.date}
                          </TableCell>
                          <TableCell className="font-medium">{submission.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3" />
                                {submission.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3" />
                                {submission.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{submission.propertyType}</TableCell>
                          <TableCell>{submission.location}</TableCell>
                          <TableCell className="font-semibold">{submission.budget}</TableCell>
                          <TableCell>
                            <Badge variant={submission.status === "New" ? "default" : "secondary"}>
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                data-testid={`button-view-quote-${submission.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                data-testid={`button-delete-quote-${submission.id}`}
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
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="text-sm text-muted-foreground">
                            {submission.date}
                          </TableCell>
                          <TableCell className="font-medium">{submission.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3" />
                                {submission.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3" />
                                {submission.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
                          <TableCell>
                            <Badge
                              variant={submission.status === "New" ? "default" : "secondary"}
                            >
                              {submission.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                data-testid={`button-view-contact-${submission.id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                data-testid={`button-delete-contact-${submission.id}`}
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
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
