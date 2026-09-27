import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";

dotenv.config();

const seedAdmin = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("MONGO_URI is not defined in .env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const adminEmail = "admin@kakinadamarketplace.com";
    const adminPassword = "ChangeThisPassword123"; // change before running

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin already exists:", adminEmail);
      process.exit(0);
    }

    const admin = await User.create({ name: "Admin", email: adminEmail, password: adminPassword, role: "admin" });

    console.log("Admin created successfully:");
    console.log("Email:", admin.email);
    console.log("Password:", adminPassword, "(save this somewhere safe, then change it later)");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();