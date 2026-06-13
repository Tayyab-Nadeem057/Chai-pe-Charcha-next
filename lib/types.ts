// Shared types for the storefront + admin.

export type Variant = { label: string; price_offset: number };

export type MenuItem = {
  id: number;
  category_id: string;
  name: string;
  price: number;
  image_url: string | null;
  variants: Variant[] | null;
  dine_in: boolean;
  takeaway: boolean;
  delivery: boolean;
  is_active: boolean;
  sold_out: boolean;
  is_featured: boolean;
  sort_order: number;
};

export type Category = {
  id: string;
  label: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  items: MenuItem[];
};

// A line in the cart. price is for DISPLAY only — the server re-prices everything.
export type CartLine = {
  item_id: number;
  name: string; // includes variant label, e.g. "Chicken Karahi (Full)"
  variant: string | null;
  price: number;
  quantity: number;
};
