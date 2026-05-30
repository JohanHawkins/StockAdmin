import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../shared/toast/toast';
import { ProductService } from '../services/product.service';
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

  currentIndex = -1;

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
    stock: ''
  };

  generateProductCode(): string {
    if (this.products.length === 0) {
      return 'P001';
    }

    const lastProduct = this.products[this.products.length - 1];

    const lastCodeNumber = parseInt(lastProduct.code.replace('P', ''));

    const nextNumber = lastCodeNumber + 1;

    return 'P' + nextNumber.toString().padStart(3, '0');
  }

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  openModal() {
  this.clearErrors();

    this.newProduct = {
      code: this.generateProductCode(),
      name: '',
      price: 0,
      stock: 0,
      status: 'Activo',
    };

    this.showModal = true;

    this.isEditing = false;
  }

  closeModal() {
    this.showModal = false;
  }

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

    if (this.newProduct.price <= 0 || !Number.isInteger(this.newProduct.price)) {
      this.formErrors.price = 'El precio debe ser un valor mayor a 0';
      this.showToast('El precio debe ser un valor mayor a 0', 'error');

      return;
    }

    if (this.newProduct.stock < 0 || !Number.isInteger(this.newProduct.stock)) {
      this.formErrors.stock = 'El stock debe ser un valor mayor a 0';
      this.showToast('El stock debe ser un valor mayor a 0', 'error');

      return;
    }

    const wasEditing = this.isEditing;

    if (this.isEditing) {
      this.productService.updateProduct(this.currentIndex, { ...this.newProduct });
    } else {
      this.productService.addProduct({ ...this.newProduct });
    }

    this.resetForm();

    this.showToast(
      wasEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
      'success',
    );

    this.closeModal();
  }

  editProduct(product: Product, index: number) {
    this.newProduct = {
      ...product,
    };

    this.currentIndex = index;

    this.isEditing = true;

    this.showModal = true;
  }

  openDeleteModal(index: number) {
    this.currentIndex = index;

    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    this.showToast('Producto eliminado correctamente', 'success');

    this.productService.deleteProduct(this.currentIndex);

    this.closeDeleteModal();
  }

  resetForm() {
    this.newProduct = {
      code: '',
      name: '',
      price: 0,
      stock: 0,
      status: 'Activo',
    };

    this.currentIndex = -1;

    this.isEditing = false;
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;

    this.toastType = type;

    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  clearErrors(){

  this.formErrors = {
      code: '',
      name: '',
      price: '',
      stock: ''
    };
  }

  get filteredProducts(): Product[] {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }
}
