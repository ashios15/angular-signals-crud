import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { ProductStore } from "../../store/product.store";
import { CurrencyPipe, DatePipe } from "@angular/common";

@Component({
  selector: "app-product-list",
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-4">
      <!-- Stats row using computed signals -->
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <p class="text-sm text-gray-500">Total Products</p>
          <p class="text-2xl font-bold text-gray-900">{{ store.totalCount() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <p class="text-sm text-gray-500">In Stock</p>
          <p class="text-2xl font-bold text-emerald-600">{{ store.inStockCount() }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <p class="text-sm text-gray-500">Showing</p>
          <p class="text-2xl font-bold text-indigo-600">{{ store.filteredCount() }}</p>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-3">
        <input
          type="search"
          placeholder="Filter products…"
          class="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          (input)="store.setFilter($any($event.target).value)"
          aria-label="Filter products"
        />
        <a
          routerLink="/products/new"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add Product
        </a>
      </div>

      <!-- Product table — Angular 17 @for control flow -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200" role="table">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Price</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Stock</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Created</th>
              <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (product of store.filteredProducts(); track product.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-xs text-gray-500 truncate max-w-xs">{{ product.description }}</p>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {{ product.category }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right font-mono text-sm">
                  {{ product.price | currency }}
                </td>
                <td class="px-4 py-3 text-center">
                  @if (product.inStock) {
                    <span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" title="In stock"></span>
                  } @else {
                    <span class="inline-block h-2.5 w-2.5 rounded-full bg-red-400" title="Out of stock"></span>
                  }
                </td>
                <td class="px-4 py-3 text-right text-xs text-gray-500">
                  {{ product.createdAt | date: 'mediumDate' }}
                </td>
                <td class="px-4 py-3 text-right space-x-2">
                  <a
                    [routerLink]="['/products', product.id, 'edit']"
                    class="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Edit
                  </a>
                  <button
                    (click)="onDelete(product.id, product.name)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="px-4 py-12 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProductListComponent {
  readonly store = inject(ProductStore);

  onDelete(id: string, name: string): void {
    if (confirm(`Delete "${name}"?`)) {
      this.store.remove(id);
    }
  }
}
