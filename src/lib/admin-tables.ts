/** Tables the generic admin CRUD layer may touch, plus their default ordering. */
export const ADMIN_TABLES = [
  "services",
  "case_studies",
  "blog_posts",
  "team_members",
  "availability_slots",
  "media_library",
  "seo_settings",
  "enquiries",
  "quote_requests",
  "bookings",
  "products",
  "orders",
  "download_logs",
  "chat_sessions",
] as const;

export type AdminTable = (typeof ADMIN_TABLES)[number];

export const ADMIN_ORDER: Record<AdminTable, { column: string; ascending: boolean }> = {
  services: { column: "sort_order", ascending: true },
  case_studies: { column: "sort_order", ascending: true },
  blog_posts: { column: "created_at", ascending: false },
  team_members: { column: "sort_order", ascending: true },
  availability_slots: { column: "day_of_week", ascending: true },
  media_library: { column: "created_at", ascending: false },
  seo_settings: { column: "path", ascending: true },
  enquiries: { column: "created_at", ascending: false },
  quote_requests: { column: "created_at", ascending: false },
  bookings: { column: "created_at", ascending: false },
  products: { column: "sort_order", ascending: true },
  orders: { column: "created_at", ascending: false },
  download_logs: { column: "created_at", ascending: false },
  chat_sessions: { column: "created_at", ascending: false },
};
