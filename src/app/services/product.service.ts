import { Injectable } from '@angular/core';
import { PlatformService } from './platform.service';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storageKey = 'products';
  private products: Product[] = [];

  constructor(private platform: PlatformService) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (!this.platform.isBrowser()) {
      this.products = [];
      return;
    }

    const data = localStorage.getItem(this.storageKey);

    if (data) {
      this.products = JSON.parse(data);
    } else {
      this.products = [
        {
          code: 'P001',
          name: 'Mouse Gamer',
          description: 'Mouse gamer con RGB y 12000 DPI',
          price: 80,
          stock: 10,
          minStock: 3,
          categoryCode: 'C001',
          status: 'Activo',
        },
        {
          code: 'P002',
          name: 'Teclado Mecánico',
          description: 'Teclado mecánico switches Blue',
          price: 150,
          stock: 5,
          minStock: 2,
          categoryCode: 'C001',
          status: 'Activo',
        },
      ];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    if (!this.platform.isBrowser()) return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.products));
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product): void {
    this.products.push(product);
    this.saveToStorage();
  }

  updateProduct(code: string, product: Product): void {
    const index = this.products.findIndex((p) => p.code === code);
    if (index !== -1) {
      this.products[index] = product;
      this.saveToStorage();
    }
  }

  deleteProduct(code: string): void {
    const index = this.products.findIndex((p) => p.code === code);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveToStorage();
    }
  }

  toggleStatus(code: string): void {
    const product = this.products.find((p) => p.code === code);
    if (product) {
      product.status = product.status === 'Activo' ? 'Inactivo' : 'Activo';
      this.saveToStorage();
    }
  }
}
