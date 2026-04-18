import { Injectable, signal, computed } from "@angular/core";
import { Product, CreateProduct } from "../models/product.model";

@Injectable({ providedIn: "root" })
export class ProductStore {
  // --- State as Signals ---
  private readonly _products = signal<Product[]>(this.loadFromStorage());
  private readonly _filter = signal<string>("");
  private readonly _sortField = signal<keyof Product>("createdAt");
  private readonly _sortDirection = signal<"asc" | "desc">("desc");

  // --- Derived state via computed signals ---
  readonly products = this._products.asReadonly();

  readonly filteredProducts = computed(() => {
    const query = this._filter().toLowerCase();
    let items = this._products();

    if (query) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    const field = this._sortField();
    const dir = this._sortDirection();
    return [...items].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal < bVal) return dir === "asc" ? -1 : 1;
      if (aVal > bVal) return dir === "asc" ? 1 : -1;
      return 0;
    });
  });

  readonly totalCount = computed(() => this._products().length);
  readonly filteredCount = computed(() => this.filteredProducts().length);
  readonly inStockCount = computed(() => this._products().filter((p) => p.inStock).length);

  readonly categories = computed(() => {
    const cats = new Set(this._products().map((p) => p.category));
    return Array.from(cats).sort();
  });

  // --- Actions ---

  setFilter(query: string): void {
    this._filter.set(query);
  }

  setSort(field: keyof Product, direction: "asc" | "desc"): void {
    this._sortField.set(field);
    this._sortDirection.set(direction);
  }

  add(data: CreateProduct): Product {
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    this._products.update((list) => [...list, product]);
    this.persist();
    return product;
  }

  update(id: string, data: Partial<CreateProduct>): void {
    this._products.update((list) =>
      list.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    this.persist();
  }

  remove(id: string): void {
    this._products.update((list) => list.filter((p) => p.id !== id));
    this.persist();
  }

  getById(id: string): Product | undefined {
    return this._products().find((p) => p.id === id);
  }

  // --- Persistence ---

  private persist(): void {
    try {
      localStorage.setItem("angular-signals-products", JSON.stringify(this._products()));
    } catch {
      // Storage full or unavailable — ignore silently
    }
  }

  private loadFromStorage(): Product[] {
    try {
      const raw = localStorage.getItem("angular-signals-products");
      if (!raw) return this.seedData();
      return JSON.parse(raw);
    } catch {
      return this.seedData();
    }
  }

  private seedData(): Product[] {
    return [
      {
        id: crypto.randomUUID(),
        name: "Mechanical Keyboard",
        description: "Cherry MX Blue switches, RGB backlit, tenkeyless layout",
        price: 129.99,
        category: "Electronics",
        inStock: true,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: crypto.randomUUID(),
        name: "Standing Desk",
        description: "Electric adjustable height, 60x30 bamboo top",
        price: 449.0,
        category: "Furniture",
        inStock: true,
        createdAt: new Date("2024-02-20"),
      },
      {
        id: crypto.randomUUID(),
        name: "Noise-Cancelling Headphones",
        description: "Active noise cancellation, 30hr battery, USB-C",
        price: 299.99,
        category: "Electronics",
        inStock: false,
        createdAt: new Date("2024-03-10"),
      },
    ];
  }
}
