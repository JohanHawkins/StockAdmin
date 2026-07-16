import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../shared/toast/toast';
import { ProductService } from '../services/product.service';
import { MovementService } from '../services/movement.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent {
  searchTerm = '';

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  showModal = false;
  showDeleteModal = false;

  isEditing = false;
  currentCode = '';

  products: Product[] = [];

  newProduct: Product = {
    code: '',
    name: '',
    price: 0,
    stock: 0,
    status: 'Activo',
  };

  formErrors = {
    code: '',
    name: '',
    price: '',
    stock: '',
  };

  constructor(
    private productService: ProductService,
    private movementService: MovementService,
  ) {
    this.products = this.productService.getProducts();
  }

  // -------------------------
  // TOAST
  // -------------------------
  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  // -------------------------
  // MODAL
  // -------------------------
  openModal() {
    this.clearErrors();

    this.newProduct = {
      code: this.generateProductCode(),
      name: '',
      price: 0,
      stock: 0,
      status: 'Activo',
    };

    this.isEditing = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  // -------------------------
  // VALIDATION + SAVE
  // -------------------------
  saveProduct() {
    this.clearErrors();

    if (!this.newProduct.code.trim()) {
      this.formErrors.code = 'El código es obligatorio';
      this.showToast('El código es obligatorio', 'error');
      return;
    }

    if (!this.newProduct.name.trim()) {
      this.formErrors.name = 'El nombre es obligatorio';
      this.showToast('El nombre es obligatorio', 'error');
      return;
    }

    const nameExists = this.products.some(
      (p) =>
        p.name.toLowerCase() === this.newProduct.name.trim().toLowerCase() &&
        p.code !== this.currentCode,
    );

    if (nameExists) {
      this.formErrors.name = 'Ya existe un producto con este nombre';
      this.showToast('Ya existe un producto con este nombre', 'error');
      return;
    }

    if (this.newProduct.price <= 0 || !Number.isInteger(this.newProduct.price)) {
      this.formErrors.price = 'El precio debe ser un valor mayor a 0';
      this.showToast('El precio debe ser un valor mayor a 0', 'error');
      return;
    }

    if (this.newProduct.stock < 0 || !Number.isInteger(this.newProduct.stock)) {
      this.formErrors.stock = 'El stock debe ser un valor mayor o igual a 0';
      this.showToast('El stock debe ser un valor mayor o igual a 0', 'error');
      return;
    }

    const wasEditing = this.isEditing;

    if (this.isEditing) {
      this.productService.updateProduct(this.currentCode, {
        ...this.newProduct,
      });
    } else {
      this.productService.addProduct({
        ...this.newProduct,
      });
    }

    this.resetForm();

    this.showToast(
      wasEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
      'success',
    );

    this.closeModal();
  }

  // -------------------------
  // EDIT
  // -------------------------
  editProduct(product: Product) {
    this.newProduct = { ...product };

    this.currentCode = product.code;

    this.isEditing = true;

    this.showModal = true;
  }

  // -------------------------
  // DELETE
  // -------------------------
  openDeleteModal(code: string) {
    this.currentCode = code;

    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    const product = this.products.find((p) => p.code === this.currentCode);

    if (!product) return;

    const hasMovements = this.movementService
      .getMovements()
      .some((movement) => movement.productCode === product.code);

    if (hasMovements) {
      this.showToast('No es posible eliminar un producto con movimientos registrados', 'error');

      this.closeDeleteModal();

      return;
    }

    this.productService.deleteProduct(this.currentCode);

    this.showToast('Producto eliminado correctamente', 'success');

    this.closeDeleteModal();
  }

  // -------------------------
  // UTILS
  // -------------------------
  resetForm() {
    this.newProduct = {
      code: '',
      name: '',
      price: 0,
      stock: 0,
      status: 'Activo',
    };

    this.currentCode = '';

    this.isEditing = false;
  }

  clearErrors() {
    this.formErrors = {
      code: '',
      name: '',
      price: '',
      stock: '',
    };
  }

  clearNameError() {
    this.formErrors.name = '';
  }

  clearPriceError() {
    this.formErrors.price = '';
  }

  clearStockError() {
    this.formErrors.stock = '';
  }

  // -------------------------
  // CODE GENERATOR
  // -------------------------
  generateProductCode(): string {
    if (this.products.length === 0) {
      return 'P001';
    }

    const lastProduct = this.products[this.products.length - 1];

    const lastCodeNumber = parseInt(lastProduct.code.replace('P', ''));

    const nextNumber = lastCodeNumber + 1;

    return 'P' + nextNumber.toString().padStart(3, '0');
  }

  // -------------------------
  // FILTER
  // -------------------------
  get filteredProducts(): Product[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  get selectedProduct(): Product | null {
    if (!this.currentCode) {
      return null;
    }

    return this.products.find((p) => p.code === this.currentCode) ?? null;
  }
}
