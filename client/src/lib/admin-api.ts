import { createContext, useContext } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Contact, Property, PropertyPatch, Quote } from "@shared/schema";
import type { InquiryStatus } from "@shared/property";

// The token is only ever typed in by the admin and verified by the server.
// sessionStorage keeps it for this tab only; it is cleared when the tab closes.
const TOKEN_KEY = "embassy-admin-token";

export function readStoredToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string | null) {
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

export class UnauthorizedError extends Error {}

export async function adminFetch(url: string, token: string, init: RequestInit = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new UnauthorizedError("Your session is no longer valid. Please log in again.");
  if (res.status === 429) throw new Error("Too many attempts. Please wait a few minutes.");
  if (res.status === 503) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "This feature is not configured on the server");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const issue = body?.issues?.[0];
    const detail = issue ? `${issue.path?.join(".") || "input"}: ${issue.message}` : body?.error;
    throw new Error(detail ? `${detail}` : `Request failed (${res.status})`);
  }
  return res;
}

export type AdminSession = {
  token: string;
  uploadsEnabled: boolean;
  logout: () => void;
};

export const AdminSessionContext = createContext<AdminSession | null>(null);

export function useAdminSession() {
  const session = useContext(AdminSessionContext);
  if (!session) throw new Error("useAdminSession must be used inside the admin app");
  return session;
}

export const adminKeys = {
  properties: ["admin", "properties"] as const,
  property: (id: string) => ["admin", "properties", id] as const,
  quotes: ["admin", "quotes"] as const,
  contacts: ["admin", "contacts"] as const,
};

// Public property queries are keyed under "/api/properties"; refresh them after admin edits
function invalidateProperties() {
  queryClient.invalidateQueries({ queryKey: adminKeys.properties });
  queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
}

export function useAdminQuery<T>(queryKey: readonly unknown[], url: string, enabled = true) {
  const { token } = useAdminSession();
  return useQuery<T>({
    queryKey,
    enabled,
    staleTime: 30_000,
    queryFn: async () => (await adminFetch(url, token)).json(),
  });
}

export function useProperties() {
  return useAdminQuery<Property[]>(adminKeys.properties, "/api/admin/properties");
}

export function useQuotes() {
  return useAdminQuery<Quote[]>(adminKeys.quotes, "/api/quotes");
}

export function useContacts() {
  return useAdminQuery<Contact[]>(adminKeys.contacts, "/api/contacts");
}

// Shared error handling: an invalid session sends the admin back to login
export function useAdminErrorHandler() {
  const { logout } = useAdminSession();
  const { toast } = useToast();
  return (error: Error) => {
    if (error instanceof UnauthorizedError) logout();
    toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
  };
}

function jsonInit(method: string, body: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export function usePatchProperty() {
  const { token } = useAdminSession();
  const onError = useAdminErrorHandler();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: PropertyPatch }) =>
      (await adminFetch(`/api/admin/properties/${encodeURIComponent(id)}`, token, jsonInit("PATCH", patch))).json() as Promise<Property>,
    // Optimistic: the table reflects the change immediately
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.properties });
      const previous = queryClient.getQueryData<Property[]>(adminKeys.properties);
      queryClient.setQueryData<Property[]>(adminKeys.properties, (list) =>
        list?.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      );
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(adminKeys.properties, context.previous);
      onError(error);
    },
    onSettled: invalidateProperties,
  });
}

export function useSaveProperty() {
  const { token } = useAdminSession();
  const onError = useAdminErrorHandler();
  return useMutation({
    mutationFn: async ({ id, input }: { id?: string; input: unknown }) => {
      const res = id
        ? await adminFetch(`/api/admin/properties/${encodeURIComponent(id)}`, token, jsonInit("PUT", input))
        : await adminFetch("/api/admin/properties", token, jsonInit("POST", input));
      return (await res.json()) as Property;
    },
    onSuccess: (property) => {
      queryClient.setQueryData(adminKeys.property(property.id), property);
      invalidateProperties();
    },
    onError,
  });
}

export function useDeleteProperty() {
  const { token } = useAdminSession();
  const onError = useAdminErrorHandler();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminFetch(`/api/admin/properties/${encodeURIComponent(id)}`, token, { method: "DELETE" });
    },
    onSuccess: invalidateProperties,
    onError,
  });
}

export type InquiryKind = "quotes" | "contacts";

export function useUpdateInquiryStatus(kind: InquiryKind) {
  const { token } = useAdminSession();
  const onError = useAdminErrorHandler();
  const key = adminKeys[kind];
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: InquiryStatus }) => {
      await adminFetch(`/api/${kind}/${encodeURIComponent(id)}`, token, jsonInit("PATCH", { status }));
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<(Quote | Contact)[]>(key);
      queryClient.setQueryData<(Quote | Contact)[]>(key, (list) => list?.map((i) => (i.id === id ? { ...i, status } : i)));
      return { previous };
    },
    onError: (error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      onError(error);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteInquiry(kind: InquiryKind) {
  const { token } = useAdminSession();
  const onError = useAdminErrorHandler();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminFetch(`/api/${kind}/${encodeURIComponent(id)}`, token, { method: "DELETE" });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys[kind] }),
    onError,
  });
}

// Resizes in the browser before upload: keeps uploads fast and under the 4MB server limit
async function resizeImage(file: File, maxSize = 1920): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))), "image/jpeg", 0.85),
  );
}

export async function uploadImage(file: File, token: string): Promise<string> {
  const image = await resizeImage(file);
  const res = await adminFetch("/api/admin/uploads", token, {
    method: "POST",
    headers: { "Content-Type": "image/jpeg" },
    body: image,
  });
  return (await res.json()).url;
}
