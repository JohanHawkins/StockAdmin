import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MovementService } from '../services/movement.service';
import { ProductService } from '../services/product.service';
import { Movement } from '../models/movement.model';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class MovementsComponent {
  showModal = false;
  movements: Movement[] = [];
  products: Product[] = [];

  selectedProductId = 0;

  movementType: 'ENTRADA' | 'SALIDA' = 'ENTRADA';

  quantity = 1;

  openModal(): void {
    this.resetForm();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  newMovement: Movement = {
    id: '',
    productCode: '',
    type: '' as any,
    quantity: 0,
    date: new Date(),
  };

  constructor(
    private movementService: MovementService,
    private productService: ProductService,
  ) {
    this.movements = this.movementService.getMovements();
    this.products = this.productService.getProducts();
  }

  addMovement(): void {
    if (!this.newMovement.productCode || this.newMovement.quantity <= 0) {
      return;
    }

    this.newMovement.id = this.movementService.generateId();
    this.newMovement.date = new Date();

    // actualizar stock
    const product = this.products.find((p) => p.code === this.newMovement.productCode);

    if (!product) return;
    if (this.newMovement.type === 'SALIDA' && this.newMovement.quantity > product.stock) {
      alert('No hay stock suficiente para realizar la salida.');
      return;
    }
    if (this.newMovement.type === 'ENTRADA') {
      product.stock += this.newMovement.quantity;
    } else {
      product.stock -= this.newMovement.quantity;
    }

    this.movementService.addMovement({ ...this.newMovement });
    this.movements = this.movementService.getMovements();
    this.closeModal();
    this.resetForm();
  }

  resetForm(): void {
    this.newMovement = {
      id: '',
      productCode: '',
      type: 'ENTRADA',
      quantity: 0,
      date: new Date(),
    };
  }
}
