import { useCallback, useEffect, useState } from "react";

export type CartItem = {
  slug: string;
  title: string;
  price: number;
  currency: string;
  coverImageUrl: string | null;
};

const KEY = "jd-cart-v1";
const EVENT = "jd-cart-change";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item?.slug === "string") : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function formatPrice(amount: number, currency: string) {
  if (!amount) return "Free";
  try {
    return new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString()}`;
  }
}

/** Guest cart persisted in the browser — digital products, one licence per line. */
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((item: CartItem) => {
    const current = read();
    if (current.some((entry) => entry.slug === item.slug)) return false;
    write([...current, item]);
    return true;
  }, []);

  const remove = useCallback((slug: string) => {
    write(read().filter((entry) => entry.slug !== slug));
  }, []);

  const clear = useCallback(() => write([]), []);

  const total = items.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const currency = items[0]?.currency ?? "NGN";

  return { items, add, remove, clear, total, currency, count: items.length };
}
