export type ProductPayload = {
  name: string;
  brand: string;
  price: number;
  original_price?: number | null;
  category: string;
  image?: string | null;
  badge?: string | null;
  stock?: number;
  description?: string;
  active?: boolean;
};

export type OrderItem = {
  productId?: number;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type CustomerPayload = {
  email: string;
  name?: string;
  phone?: string;
  address?: string;
};
