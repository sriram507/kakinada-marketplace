import mongoose from "mongoose";
import dotenv from "dotenv";
import { Order } from "../models/Order";
import { Product } from "../models/Product";

dotenv.config();

const ABANDONED_AFTER_MINUTES = 30;

const cleanupAbandonedOrders = async (): Promise<void> => {
  const cutoff = new Date(Date.now() - ABANDONED_AFTER_MINUTES * 60 * 1000);

  const abandoned = await Order.find({
    paymentMethod: "online",
    status: "pending",
    paymentStatus: "pending",
    createdAt: { $lt: cutoff },
  });

  if (abandoned.length === 0) {
    console.log("No abandoned orders found.");
    return;
  }

  for (const order of abandoned) {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = "cancelled";
    await order.save();

    console.log(`Cancelled abandoned order ${order.id}, stock restored for ${order.items.length} item(s).`);
  }

  console.log(`\nDone: ${abandoned.length} abandoned order(s) cleaned up.`);
};

const main = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
    await cleanupAbandonedOrders();
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

main();
