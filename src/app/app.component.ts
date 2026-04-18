import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <nav class="bg-white shadow-sm border-b">
        <div class="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 class="text-lg font-bold text-indigo-600">Angular Signals CRUD</h1>
          <span class="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            Angular 17+ • Signals • Standalone
          </span>
        </div>
      </nav>
      <main class="max-w-5xl mx-auto px-4 py-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
