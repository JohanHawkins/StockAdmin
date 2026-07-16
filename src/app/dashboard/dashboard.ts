import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  movements: Movement[] = [];
  isLoading = true;

  totalProducts = 0;
  totalCategories = 0;
  totalMovements = 0;
  totalStock = 0;
  inventoryValue = 0;
  activeProducts = 0;
  highestStockProduct: Product | null = null;
  mostExpensiveProduct: Product | null = null;
  lastMovement: Movement | null = null;
  recentProducts: Product[] = [];
  lowStockProducts: Product[] = [];
  recentMovements: Movement[] = [];

  private productsMap = new Map<string, string>();
  private categoriesMap = new Map<string, string>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private movementService: MovementService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.products = this.productService.getProducts();
    this.categories = this.categoryService.getCategories();
    this.movements = this.movementService.getMovements();

    this.buildMaps();
    this.calculateStats();

    this.isLoading = false;
    this.cdr.markForCheck();
  }

  private buildMaps(): void {
    this.productsMap.clear();
    this.categoriesMap.clear();

    for (const product of this.products) {
      this.productsMap.set(product.code, product.name);
    }

    for (const category of this.categories) {
      this.categoriesMap.set(category.code, category.name);
    }
  }

  private calculateStats(): void {
    this.totalProducts = this.products.length;
    this.totalCategories = this.categories.length;
    this.totalMovements = this.movements.length;

    this.totalStock = 0;
    this.inventoryValue = 0;
    this.activeProducts = 0;

    let maxStockProduct: Product | null = null;
    let maxPriceProduct: Product | null = null;

    for (const product of this.products) {
      this.totalStock += product.stock;
      this.inventoryValue += product.price * product.stock;

      if (product.status === 'Activo') {
        this.activeProducts++;
      }

      if (!maxStockProduct || product.stock > maxStockProduct.stock) {
        maxStockProduct = product;
      }

      if (!maxPriceProduct || product.price > maxPriceProduct.price) {
        maxPriceProduct = product;
      }
    }

    this.highestStockProduct = maxStockProduct;
    this.mostExpensiveProduct = maxPriceProduct;

    if (this.movements.length > 0) {
      this.lastMovement = [...this.movements].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];
    } else {
      this.lastMovement = null;
    }

    this.recentProducts = this.products.slice(-5).reverse();
    this.lowStockProducts = this.products.filter(
      (product) => product.stock <= product.minStock,
    );

    this.recentMovements = [...this.movements]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }

  getProductName(productCode: string): string {
    return this.productsMap.get(productCode) ?? productCode;
  }

  getCategoryName(code: string): string {
    return this.categoriesMap.get(code) ?? code;
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

  formatCurrency(value: number): string {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  trackByProductCode(index: number, product: Product): string {
    return product.code;
  }

  trackByMovementId(index: number, movement: Movement): string {
    return movement.id;
  }
}
