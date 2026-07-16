import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { MovementService } from '../services/movement.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Movement } from '../models/movement.model';
import { SpinnerComponent } from '../shared/spinner/spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  movements: Movement[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private movementService: MovementService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.products = this.productService.getProducts();
      this.categories = this.categoryService.getCategories();
      this.movements = this.movementService.getMovements();
      this.isLoading = false;
    }, 500);
  }

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

  get inventoryValue(): number {
    return this.products.reduce((total, product) => total + product.price * product.stock, 0);
  }

  get activeProducts(): number {
    return this.products.filter((product) => product.status === 'Activo').length;
  }

  get highestStockProduct(): Product | null {
    if (this.products.length === 0) return null;
    return this.products.reduce((max, p) => (p.stock > max.stock ? p : max));
  }

  get mostExpensiveProduct(): Product | null {
    if (this.products.length === 0) return null;
    return this.products.reduce((max, p) => (p.price > max.price ? p : max));
  }

  get lastMovement(): Movement | null {
    if (this.movements.length === 0) return null;
    return [...this.movements].sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  }

  get recentProducts(): Product[] {
    return [...this.products].slice(-5).reverse();
  }

  get lowStockProducts(): Product[] {
    return this.products.filter((product) => product.stock <= product.minStock);
  }

  get recentMovements(): Movement[] {
    return [...this.movements].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }

  getProductName(productCode: string): string {
    const product = this.products.find((p) => p.code === productCode);
    return product?.name ?? productCode;
  }

  getCategoryName(code: string): string {
    const category = this.categories.find((c) => c.code === code);
    return category?.name ?? code;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
