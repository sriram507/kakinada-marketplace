import mongoose, { Document, Schema, Types } from "mongoose";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "online";

export interface IOrderItem {
  sellerId: Types.ObjectId;
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customerId: Types.ObjectId;
  items: IOrderItem[];
  itemsTotal: number;
  deliveryCharge: number;
  commissionRate: number;
  commissionAmount: number;
  grandTotal: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryPhone: string;
  paymentMethod: PaymentMethod;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    itemsTotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    commissionRate: { type: Number, required: true, min: 0 },
    commissionAmount: { type: Number, required: true, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryAddress: { type: String, required: true, trim: true },
    deliveryPhone: { type: String, required: true, trim: true },
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);