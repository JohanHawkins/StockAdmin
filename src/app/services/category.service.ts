import { Injectable } from '@angular/core';

import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private storageKey = 'categories';

  private categories: Category[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private loadFromStorage(): void {
    if (!this.isBrowser()) {
      this.categories = [];
      return;
    }

    const data = localStorage.getItem(this.storageKey);

    if (data) {
      this.categories = JSON.parse(data);
    } else {
      this.categories = [
        {
          code: 'C001',
          name: 'Tecnología',
        },
        {
          code: 'C002',
          name: 'Accesorios',
        },
      ];

      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this.categories));
  }

  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(category: Category): void {
    this.categories.push(category);

    this.saveToStorage();
  }

  updateCategory(code: string, category: Category): void {
    const index = this.categories.findIndex((c) => c.code === code);

    if (index !== -1) {
      this.categories[index] = category;
      this.saveToStorage();
    }
  }

  deleteCategory(code: string): void {
    const index = this.categories.findIndex((c) => c.code === code);

    if (index !== -1) {
      this.categories.splice(index, 1);
      this.saveToStorage();
    }
  }
}
