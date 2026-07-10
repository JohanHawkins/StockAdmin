import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { MovementService } from '../services/movement.service';

import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Movement } from '../models/movement.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  products: Product[] = [];

  categories: Category[] = [];

  movements: Movement[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private movementService: MovementService,
  ) {
    this.products = this.productService.getProducts();

    this.categories = this.categoryService.getCategories();

    this.movements = this.movementService.getMovements();
  }

  // ==========================
  // TARJETAS PRINCIPALES
  // ==========================

  get totalProducts(): number {
    return this.products.length;
  }

  get totalCategories(): number {
    return this.categories.length;
  }

  get totalMovements(): number {
    return this.movements.length;
  }

  get totalStock(): number {
    return this.products.reduce((total, product) => total + product.stock, 0);
  }

  // ==========================
  // INDICADORES
  // ==========================

  get inventoryValue(): number {
    return this.products.reduce((total, product) => total + product.price * product.stock, 0);
  }

  get activeProducts(): number {
    return this.products.filter((product) => product.status === 'Activo').length;
  }

  // ==========================
  // LISTADOS
  // ==========================

  get recentProducts(): Product[] {
    return [...this.products].slice(-5).reverse();
  }

  get lowStockProducts(): Product[] {
    return this.products.filter((product) => product.stock <= 5);
  }

  get recentMovements(): Movement[] {
    return [...this.movements].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }

  getProductName(productCode: string): string {
    const product = this.products.find((p) => p.code === productCode);

    return product?.name ?? productCode;
  }
}
