/**
 * Role-based permissions for the admin dashboard.
 * Client-safe: no secrets, no server-only imports. The same map is enforced
 * again on the server in `admin.functions.ts`.
 */
export type AdminRole = "admin" | "editor" | "viewer";

export type AdminResource =
  | "services"
  | "case_studies"
  | "blog_posts"
  | "team_members"
  | "availability_slots"
  | "media_library"
  | "seo_settings"
  | "products"
  | "enquiries"
  | "quote_requests"
  | "bookings"
  | "orders"
  | "download_logs"
  | "chat_sessions"
  | "site_settings"
  | "user_roles"
  | "activity_log";

export const ROLE_LABEL: Record<AdminRole, string> = {
  admin: "Administrator",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTION: Record<AdminRole, string> = {
  admin: "Full access, including team access, orders, settings and the activity log.",
  editor: "Can create and edit content (services, portfolio, blog, team, products, media, SEO) and read submissions.",
  viewer: "Read-only access to content and submissions.",
};

const CONTENT: AdminResource[] = [
  "services",
  "case_studies",
  "blog_posts",
  "team_members",
  "availability_slots",
  "media_library",
  "seo_settings",
  "products",
];

const SUBMISSIONS: AdminResource[] = ["enquiries", "quote_requests", "bookings", "chat_sessions"];

const READ: Record<AdminRole, AdminResource[] | "*"> = {
  admin: "*",
  editor: [...CONTENT, ...SUBMISSIONS],
  viewer: [...CONTENT, ...SUBMISSIONS],
};

const WRITE: Record<AdminRole, AdminResource[] | "*"> = {
  admin: "*",
  editor: CONTENT,
  viewer: [],
};

export function canRead(role: AdminRole, resource: AdminResource): boolean {
  const allowed = READ[role];
  return allowed === "*" || allowed.includes(resource);
}

export function canWrite(role: AdminRole, resource: AdminResource): boolean {
  const allowed = WRITE[role];
  return allowed === "*" || allowed.includes(resource);
}

/** Nav sections, each gated by the resource it manages. */
export const ADMIN_SECTIONS: { to: string; label: string; resource: AdminResource }[] = [
  { to: "/admin/services", label: "Services", resource: "services" },
  { to: "/admin/portfolio", label: "Portfolio", resource: "case_studies" },
  { to: "/admin/blog", label: "Blog", resource: "blog_posts" },
  { to: "/admin/team", label: "Team", resource: "team_members" },
  { to: "/admin/products", label: "Products", resource: "products" },
  { to: "/admin/orders", label: "Orders", resource: "orders" },
  { to: "/admin/submissions", label: "Submissions", resource: "enquiries" },
  { to: "/admin/media", label: "Media", resource: "media_library" },
  { to: "/admin/chats", label: "JDBot Chats", resource: "chat_sessions" },
  { to: "/admin/seo", label: "SEO", resource: "seo_settings" },
  { to: "/admin/access", label: "Team Access", resource: "user_roles" },
  { to: "/admin/activity", label: "Activity Log", resource: "activity_log" },
  { to: "/admin/settings", label: "Settings", resource: "site_settings" },
];

export function roleRank(role: AdminRole): number {
  return role === "admin" ? 3 : role === "editor" ? 2 : 1;
}
