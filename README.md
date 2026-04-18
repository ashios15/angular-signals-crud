# Angular Signals CRUD

Full CRUD application built with **Angular 17+** showcasing the latest Angular features: **Signals**, **standalone components**, **new control flow syntax**, and **lazy-loaded routes**.

![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Signals](https://img.shields.io/badge/State-Signals-8B5CF6)

## Architecture

```
src/app/
├── app.component.ts          # Root standalone component
├── app.routes.ts              # Route config with lazy loading
├── models/
│   └── product.model.ts       # TypeScript interfaces
├── store/
│   └── product.store.ts       # Signal-based reactive store
└── features/products/
    ├── product-list.component.ts   # List with filter, sort, computed stats
    └── product-form.component.ts   # Create/Edit with two-way binding
```

## Signal Store Pattern

```typescript
// Reactive state
private readonly _products = signal<Product[]>([]);

// Derived state (auto-recomputes when dependencies change)
readonly filteredProducts = computed(() => {
  const query = this._filter().toLowerCase();
  return this._products().filter(p =>
    p.name.toLowerCase().includes(query)
  );
});

// Stats — also derived
readonly totalCount = computed(() => this._products().length);
readonly inStockCount = computed(() =>
  this._products().filter(p => p.inStock).length
);
```

## Features

- Create, read, update, delete products
- Real-time filtering with computed signals
- Stats dashboard (total, in-stock, filtered counts)
- localStorage persistence
- Seed data on first load
- Fully responsive table layout

## Getting Started

```bash
npm install
npm start
# Open http://localhost:4200
```

## License

MIT
