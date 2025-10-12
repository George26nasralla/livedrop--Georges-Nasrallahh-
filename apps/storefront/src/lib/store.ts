
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const existing = get().items.find(i => i.id === item.id);
        const updated = existing
          ? get().items.map(i =>
              i.id === item.id ? { ...i, qty: i.qty + qty } : i
            )
          : [...get().items, { ...item, qty }];
        set({ items: updated });
      },
      remove: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      setQty: (id, qty) =>
        set({
          items: get().items.map(i => (i.id === id ? { ...i, qty } : i)),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);

// Helper function to calculate total - use this in your components
export const useCartTotal = () => {
  const items = useCart((state) => state.items);
  return items.reduce((t, i) => t + i.price * i.qty, 0);
};