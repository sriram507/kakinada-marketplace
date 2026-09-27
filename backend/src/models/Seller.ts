import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISeller extends Document {
  userId: Types.ObjectId;
  shopName: string;
  address: string;
  phone: string;
  category: string;
  isApproved: boolean;
  appliedAt: Date;
}

const sellerSchema = new Schema<ISeller>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    shopName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Seller = mongoose.model<ISeller>("Seller", sellerSchema);