import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../shared/toast/toast';

import { MovementService } from '../services/movement.service';
import { ProductService } from '../services/product.service';
import { Movement } from '../models/movement.model';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class MovementsComponent {
  showModal = false;

  toastVisible = false;

  toastMessage = '';

  toastType: 'success' | 'error' = 'success';

  movements: Movement[] = [];

  products: Product[] = [];

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

  openModal(): void {
    this.resetForm();

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  getProductName(productCode: string): string {
    const product = this.products.find((p) => p.code === productCode);

    return product?.name ?? productCode;
  }

  getSelectedProduct(): Product | undefined {
    return this.products.find((p) => p.code === this.newMovement.productCode);
  }

  addMovement(): void {
    if (!this.newMovement.productCode) {
      this.showToast('Debe seleccionar un producto', 'error');
      return;
    }

    if (this.newMovement.quantity <= 0) {
      this.showToast('La cantidad debe ser mayor a 0', 'error');
      return;
    }

    this.newMovement.id = this.movementService.generateId();

    this.newMovement.date = new Date();

    const product = this.products.find((p) => p.code === this.newMovement.productCode);

    if (!product) {
      this.showToast('Producto no encontrado', 'error');
      return;
    }

    if (this.newMovement.type === 'SALIDA' && this.newMovement.quantity > product.stock) {
      this.showToast('No hay stock suficiente para realizar la salida.', 'error');
      return;
    }

    if (this.newMovement.type === 'ENTRADA') {
      product.stock += this.newMovement.quantity;
    } else {
      product.stock -= this.newMovement.quantity;
    }

    this.movementService.addMovement({ ...this.newMovement });

    this.movements = this.movementService.getMovements();

    this.showToast('Movimiento registrado correctamente', 'success');

    this.closeModal();

    this.resetForm();
  }

  resetForm(): void {
    this.newMovement = {
      id: '',
      productCode: '',
      type: '' as any,
      quantity: 0,
      date: new Date(),
    };
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;

    this.toastType = type;

    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }
}
