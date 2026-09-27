import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProduct extends Document {
  sellerId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isApproved: boolean;
  isActive: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);