import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  products: Product[] = [];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  get totalProducts(): number {
    return this.products.length;
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
}
