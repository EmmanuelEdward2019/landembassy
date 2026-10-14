import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import {
  Building2,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import {
  AdminSessionContext,
  UnauthorizedError,
  adminFetch,
  readStoredToken,
  storeToken,
  useContacts,
  useQuotes,
} from "@/lib/admin-api";
import logoImage from "@assets/logo.png";
import AdminOverview from "./AdminOverview";
import AdminProperties from "./AdminProperties";
import PropertyEditor from "./PropertyEditor";
import AdminInquiries from "./AdminInquiries";

function LoginScreen({ onLogin }: { onLogin: (token: string, uploadsEnabled: boolean) => void }) {
  const { toast } = useToast();
  const [tokenInput, setTokenInput] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const candidate = tokenInput.trim();
    setPending(true);
    try {
      const session = await (await adminFetch("/api/admin/session", candidate)).json();
      onLogin(candidate, Boolean(session.uploads));
    } catch (error) {
      toast({
        title: "Access Denied",
        description: error instanceof UnauthorizedError ? "Invalid access token" : (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-black rounded-lg px-4 py-3 mb-6">
            <img src={logoImage} alt="Land Embassy" className="h-12 w-auto" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Enter your access token to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-token" className="block text-sm font-medium mb-2">
              Access Token
            </label>
            <Input
              id="admin-token"
              type="password"
              autoComplete="current-password"
              placeholder="Enter token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              required
              data-testid="input-admin-token"
            />
          </div>
          <Button type="submit" className="w-full" disabled={pending} data-testid="button-admin-login">
            {pending ? "Checking..." : "Log in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

function NavCount({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="ml-auto rounded-full bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 min-w-6 text-center">
      {count}
    </span>
  );
}

function AdminNav({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  const [location] = useLocation();
  const quotes = useQuotes();
  const contacts = useContacts();
  const newQuotes = quotes.data?.filter((q) => q.status === "new").length ?? 0;
  const newMessages = contacts.data?.filter((c) => c.status === "new").length ?? 0;

  const items = [
    { href: "/", label: "Overview", icon: LayoutDashboard, active: location === "/" },
    { href: "/properties", label: "Properties", icon: Building2, active: location.startsWith("/properties") },
    { href: "/quotes", label: "Quote Requests", icon: FileText, active: location === "/quotes", count: newQuotes },
    { href: "/messages", label: "Messages", icon: Mail, active: location === "/messages", count: newMessages },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="bg-black px-5 py-4">
        <img src={logoImage} alt="Land Embassy" className="h-10 w-auto" />
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-current={item.active ? "page" : undefined}
            data-testid={`admin-nav-${item.href.slice(1) || "overview"}`}
          >
            <item.icon className={cn("h-4 w-4", item.active && "text-primary")} />
            {item.label}
            <NavCount count={item.count ?? 0} />
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </a>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          data-testid="button-admin-logout"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [uploadsEnabled, setUploadsEnabled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const logout = useCallback(() => {
    storeToken(null);
    setToken(null);
    queryClient.removeQueries({ queryKey: ["admin"] });
  }, []);

  // A stored token from an earlier visit: re-check it and learn which features are on
  useEffect(() => {
    if (!token) return;
    adminFetch("/api/admin/session", token)
      .then((res) => res.json())
      .then((session) => setUploadsEnabled(Boolean(session.uploads)))
      .catch((error) => {
        if (error instanceof UnauthorizedError) logout();
      });
  }, [token, logout]);

  const session = useMemo(() => (token ? { token, uploadsEnabled, logout } : null), [token, uploadsEnabled, logout]);

  useEffect(() => {
    document.title = "Admin | Land Embassy";
  }, []);

  if (!session) {
    return (
      <LoginScreen
        onLogin={(newToken, uploads) => {
          storeToken(newToken);
          setUploadsEnabled(uploads);
          setToken(newToken);
        }}
      />
    );
  }

  return (
    <AdminSessionContext.Provider value={session}>
      <div className="min-h-screen bg-muted/40 lg:pl-64">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-background lg:block">
          <AdminNav onLogout={logout} />
        </aside>

        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background px-4 py-3 lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <span className="font-semibold">Land Embassy Admin</span>
        </header>
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Admin menu</SheetTitle>
            <AdminNav onNavigate={() => setMobileNavOpen(false)} onLogout={logout} />
          </SheetContent>
        </Sheet>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Switch>
            <Route path="/" component={AdminOverview} />
            <Route path="/properties" component={AdminProperties} />
            <Route path="/properties/new">{() => <PropertyEditor />}</Route>
            <Route path="/properties/:id">{(params) => <PropertyEditor id={params.id} />}</Route>
            <Route path="/quotes">{() => <AdminInquiries kind="quotes" />}</Route>
            <Route path="/messages">{() => <AdminInquiries kind="contacts" />}</Route>
            <Route>
              <div className="py-20 text-center text-muted-foreground">Page not found</div>
            </Route>
          </Switch>
        </main>
      </div>
    </AdminSessionContext.Provider>
  );
}
