import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private storageKey = 'products';

  private products: Product[] = [];

  constructor() {
    this.loadFromStorage();
    }

    private isBrowser(): boolean {
    return typeof window !== 'undefined';
    }

    private loadFromStorage(): void {

    if (!this.isBrowser()) {
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
            price: 80,
            stock: 10,
            status: 'Activo'
        },
        {
            code: 'P002',
            name: 'Teclado Mecánico',
            price: 150,
            stock: 5,
            status: 'Activo'
        }
        ];

        this.saveToStorage();
    }
    }

    private saveToStorage(): void {

    if (!this.isBrowser()) return;

    localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.products)
    );
    }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product): void {
    this.products.push(product);
    this.saveToStorage();
  }

  updateProduct(index: number, product: Product): void {
    this.products[index] = product;
    this.saveToStorage();
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
    this.saveToStorage();
  }
}