export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  itemsTotal: number;
  deliveryCharge: number;
  grandTotal: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  deliveryAddress: string;
  deliveryPhone: string;
  paymentMethod: "cod" | "online";
  paymentStatus?: "pending" | "paid" | "failed";
  providerOrderId?: string;
  createdAt: string;
}

export interface PaymentOrderInfo {
  provider: string;
  providerOrderId: string;
  amount: number;
  currency: string;
}