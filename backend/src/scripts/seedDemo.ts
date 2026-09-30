import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/User";
import { Seller } from "../models/Seller";
import { Product } from "../models/Product";

dotenv.config();

const DEMO_EMAIL_DOMAIN = "@demo.kakinada.test";
const DEMO_EMAIL_PATTERN = /@demo\.kakinada\.test$/;
const DEMO_PASSWORD = "DemoPass123";

interface DemoProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface DemoShop {
  slug: string;
  ownerName: string;
  shopName: string;
  address: string;
  phone: string;
  category: string;
  products: DemoProduct[];
}

const shops: DemoShop[] = [
  {
    slug: "sri-lakshmi",
    ownerName: "Lakshmi Devi",
    shopName: "Sri Lakshmi Imitation Jewellers",
    address: "Bhanugudi Junction, Kakinada",
    phone: "9000000001",
    category: "Imitation Jewellery",
    products: [
      { name: "Kundan Necklace Set", description: "Elegant kundan necklace with matching earrings, ideal for weddings and festive occasions.", price: 899, stock: 15 },
      { name: "Oxidised Silver Jhumkas", description: "Traditional oxidised jhumka earrings with fine detailing. Lightweight for all-day wear.", price: 249, stock: 40 },
      { name: "Temple Jewellery Haram", description: "Long temple-style haram with antique gold finish and pearl drops.", price: 1299, stock: 3 },
      { name: "Pearl Drop Earrings", description: "Classic pearl drop earrings that pair with sarees and western wear alike.", price: 199, stock: 50 },
      { name: "Antique Gold-Finish Bangles (Set of 4)", description: "Set of four bangles with a rich antique finish. Available in standard sizes.", price: 449, stock: 25 },
      { name: "Layered Choker Necklace", description: "Trendy layered choker with adjustable back chain.", price: 349, stock: 20 },
    ],
  },
  {
    slug: "madhura-fashions",
    ownerName: "Madhuri Rao",
    shopName: "Madhura Fashions",
    address: "Jagannaickpur, Kakinada",
    phone: "9000000002",
    category: "Women's Fashion",
    products: [
      { name: "Floral Print Cotton Kurti", description: "Breathable pure cotton kurti with a floral print. Comfortable for daily wear.", price: 599, stock: 30 },
      { name: "Chanderi Dupatta", description: "Soft chanderi dupatta with a zari border in assorted colours.", price: 449, stock: 25 },
      { name: "Printed Cotton Saree", description: "Lightweight printed cotton saree with a matching blouse piece.", price: 1099, stock: 12 },
      { name: "Comfort Fit Palazzo Pants", description: "Wide-leg palazzo pants with an elastic waist. Easy to pair with any kurti.", price: 379, stock: 35 },
      { name: "Readymade Saree Blouse", description: "Stitched cotton blouse with a padded cup and back hook closure.", price: 499, stock: 20 },
      { name: "Ikat Salwar Set", description: "Three-piece ikat salwar set with dupatta. Traditional weave, modern cut.", price: 1499, stock: 0 },
    ],
  },
  {
    slug: "kakinada-bags",
    ownerName: "Ravi Teja",
    shopName: "Kakinada Bags & More",
    address: "Suryaraopeta, Kakinada",
    phone: "9000000003",
    category: "Bags & Wallets",
    products: [
      { name: "Canvas Tote Bag", description: "Sturdy everyday canvas tote with an inner zip pocket.", price: 399, stock: 40 },
      { name: "Ladies Sling Bag", description: "Compact sling bag with an adjustable strap and two compartments.", price: 549, stock: 22 },
      { name: "Leather-Look Wallet", description: "Slim wallet with card slots and a coin pocket.", price: 299, stock: 60 },
      { name: "College Backpack 25L", description: "Padded 25 litre backpack with a laptop sleeve and water bottle pockets.", price: 899, stock: 18 },
      { name: "Travel Duffel Bag", description: "Roomy duffel for weekend trips, with reinforced handles and a shoulder strap.", price: 1199, stock: 9 },
      { name: "Zip Coin Purse Pouch", description: "Small zip pouch for coins, keys and earphones.", price: 99, stock: 100 },
    ],
  },
  {
    slug: "gift-galaxy",
    ownerName: "Sneha Reddy",
    shopName: "Gift Galaxy",
    address: "Ramanayyapeta, Kakinada",
    phone: "9000000004",
    category: "Gifts & Accessories",
    products: [
      { name: "Handmade Greeting Card Set", description: "Set of 6 handmade greeting cards with envelopes for birthdays and festivals.", price: 149, stock: 50 },
      { name: "Personalised Coffee Mug", description: "Ceramic mug that can be personalised with a name or short message.", price: 299, stock: 30 },
      { name: "Scented Candle Gift Box", description: "Set of 3 scented candles in a gift box. Lavender, vanilla and jasmine.", price: 399, stock: 20 },
      { name: "Photo Frame 6x8", description: "Wooden-finish tabletop photo frame for 6x8 inch prints.", price: 249, stock: 35 },
      { name: "Couple Keychain Set", description: "Matching pair of keychains in a gift pouch.", price: 129, stock: 60 },
      { name: "Gift Hamper Box (Medium)", description: "Ready-to-gift hamper box with assorted small gifts and ribbon wrapping.", price: 799, stock: 10 },
    ],
  },
  {
    slug: "vidya-stationers",
    ownerName: "Venkat Rao",
    shopName: "Vidya Stationers",
    address: "Main Road, Kakinada",
    phone: "9000000005",
    category: "Stationery",
    products: [
      { name: "A4 Ruled Notebook (Pack of 5)", description: "Five 180-page A4 ruled notebooks with sturdy covers.", price: 250, stock: 80 },
      { name: "Gel Pen Set (Pack of 10)", description: "Ten smooth-writing gel pens in assorted colours.", price: 120, stock: 100 },
      { name: "Geometry Box", description: "Complete school geometry set in a metal case.", price: 180, stock: 45 },
      { name: "A3 Sketchbook", description: "Thick A3 drawing pad, 40 sheets of 150 GSM paper.", price: 220, stock: 30 },
      { name: "Sticky Notes Combo", description: "Colourful sticky notes and page flags value pack.", price: 99, stock: 70 },
      { name: "Wooden Desk Organiser", description: "Multi-compartment desk organiser for pens, notes and cards.", price: 349, stock: 15 },
    ],
  },
];

const seedDemoData = async (): Promise<void> => {
  const existing = await User.countDocuments({ email: DEMO_EMAIL_PATTERN });
  if (existing > 0) {
    console.log("Demo data already exists. Run 'npm run seed:demo:clear' first.");
    return;
  }

  let productCount = 0;

  for (const shop of shops) {
    const user = await User.create({
      name: shop.ownerName,
      email: `${shop.slug}${DEMO_EMAIL_DOMAIN}`,
      password: DEMO_PASSWORD,
      role: "seller",
    });

    const seller = await Seller.create({
      userId: user.id,
      shopName: shop.shopName,
      address: shop.address,
      phone: shop.phone,
      category: shop.category,
      isApproved: true,
    });

    await Product.insertMany(
      shop.products.map((p) => ({
        sellerId: seller._id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        category: shop.category,
        imageUrl: "",
        isApproved: true,
        isActive: true,
      }))
    );

    productCount += shop.products.length;
    console.log(`Created: ${shop.shopName} (${shop.products.length} products)`);
  }

  console.log(`\nDone: ${shops.length} sellers, ${productCount} products.`);
  console.log(`Demo seller logins: <slug>${DEMO_EMAIL_DOMAIN} / ${DEMO_PASSWORD}`);
  console.log(`Example: ${shops[0].slug}${DEMO_EMAIL_DOMAIN}`);
};

const clearDemoData = async (): Promise<void> => {
  const demoUsers = await User.find({ email: DEMO_EMAIL_PATTERN });
  const userIds = demoUsers.map((u) => u._id);

  const demoSellers = await Seller.find({ userId: { $in: userIds } });
  const sellerIds = demoSellers.map((s) => s._id);

  const products = await Product.deleteMany({ sellerId: { $in: sellerIds } });
  const sellers = await Seller.deleteMany({ _id: { $in: sellerIds } });
  const users = await User.deleteMany({ _id: { $in: userIds } });

  console.log(
    `Removed ${products.deletedCount} products, ${sellers.deletedCount} sellers, ${users.deletedCount} users.`
  );
};

const main = async (): Promise<void> => {
  if (process.env.NODE_ENV === "production") {
    console.error("Refusing to run the demo seed in production.");
    process.exit(1);
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    if (process.argv[2] === "clear") {
      await clearDemoData();
    } else {
      await seedDemoData();
    }
  } catch (error) {
    console.error("Demo seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

main();