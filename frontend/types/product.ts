export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  sellerId: {
    _id: string;
    shopName: string;
  };
}