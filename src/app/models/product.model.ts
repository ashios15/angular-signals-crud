export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  createdAt: Date;
}

export type CreateProduct = Omit<Product, "id" | "createdAt">;
