import { Component, inject, OnInit, signal } from "@angular/core";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductStore } from "../../store/product.store";
import { CreateProduct, Product } from "../../models/product.model";

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-lg mx-auto">
      <h2 class="text-xl font-bold text-gray-900 mb-6">
        @if (isEditing()) { Edit Product } @else { New Product }
      </h2>

      <form (ngSubmit)="onSubmit()" class="space-y-4 bg-white rounded-lg shadow-sm border p-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            type="text"
            [(ngModel)]="form.name"
            name="name"
            required
            class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            [(ngModel)]="form.description"
            name="description"
            rows="3"
            class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input
              id="price"
              type="number"
              [(ngModel)]="form.price"
              name="price"
              min="0"
              step="0.01"
              required
              class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              id="category"
              type="text"
              [(ngModel)]="form.category"
              name="category"
              required
              class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input
            id="inStock"
            type="checkbox"
            [(ngModel)]="form.inStock"
            name="inStock"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          <label for="inStock" class="text-sm text-gray-700">In Stock</label>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button
            type="submit"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            @if (isEditing()) { Update } @else { Create }
          </button>
          <a routerLink="/products" class="text-sm text-gray-600 hover:text-gray-800">
            Cancel
          </a>
        </div>
      </form>
    </div>
  `,
})
export class ProductFormComponent implements OnInit {
  private readonly store = inject(ProductStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditing = signal(false);
  private editId: string | null = null;

  form: CreateProduct = {
    name: "",
    description: "",
    price: 0,
    category: "",
    inStock: true,
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      const product = this.store.getById(id);
      if (product) {
        this.editId = id;
        this.isEditing.set(true);
        this.form = {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          inStock: product.inStock,
        };
      }
    }
  }

  onSubmit(): void {
    if (this.isEditing() && this.editId) {
      this.store.update(this.editId, this.form);
    } else {
      this.store.add(this.form);
    }
    this.router.navigate(["/products"]);
  }
}
