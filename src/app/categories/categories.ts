import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesComponent {
  // -------------------------
  // STATE
  // -------------------------
  formErrors = {
    name: '',
  };

  searchTerm = '';

  categories: Category[] = [];

  newCategory = '';

  isEditing = false;

  currentCode = '';

  showModal = false;

  showDeleteModal = false;

  toastVisible = false;

  toastMessage = '';

  toastType: 'success' | 'error' = 'success';

  previewCode = '';

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {
    this.categories = this.categoryService.getCategories();
  }

  // -------------------------
  // SEARCH
  // -------------------------
  get filteredCategories(): Category[] {
    return this.categories.filter((c) =>
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  // -------------------------
  // PRODUCT COUNT
  // -------------------------
  getProductCount(categoryCode: string): number {
    return this.productService.getProducts().filter((p) => p.categoryCode === categoryCode).length;
  }

  hasProducts(categoryCode: string): boolean {
    return this.getProductCount(categoryCode) > 0;
  }

  // -------------------------
  // MODAL CREATE
  // -------------------------
  openModal(): void {
    this.showModal = true;
    this.isEditing = false;
    this.newCategory = '';
    this.currentCode = '';

    this.previewCode = this.generateCategoryCode();
  }

  closeModal(): void {
    this.showModal = false;
  }

  // -------------------------
  // EDIT
  // -------------------------
  editCategory(category: Category): void {
    this.newCategory = category.name;
    this.currentCode = category.code;
    this.isEditing = true;
    this.showModal = true;

    this.previewCode = category.code;
  }

  // -------------------------
  // SAVE (CREATE / UPDATE)
  // -------------------------
  addCategory(): void {
    if (!this.newCategory.trim()) {
      this.formErrors.name = 'El nombre es obligatorio';
      this.showToast('El nombre es obligatorio', 'error');
      return;
    }

    const categoryName = this.newCategory.trim();

    const nameExists = this.categories.some(
      (c) =>
        c.name.toLowerCase() === categoryName.toLowerCase() && c.code !== this.currentCode,
    );

    if (nameExists) {
      this.formErrors.name = 'Ya existe una categoría con este nombre';
      this.showToast('Ya existe una categoría con este nombre', 'error');
      return;
    }

    if (this.isEditing) {
      this.categoryService.updateCategory(this.currentCode, {
        ...this.categories.find((c) => c.code === this.currentCode)!,
        name: categoryName,
      });

      this.showToast('Categoría actualizada correctamente', 'success');
    } else {
      this.categoryService.addCategory({
        code: this.previewCode,
        name: categoryName,
      });

      this.showToast('Categoría creada correctamente', 'success');
    }

    this.resetForm();
    this.closeModal();
  }

  // -------------------------
  // DELETE
  // -------------------------
  openDeleteModal(code: string): void {
    this.currentCode = code;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    if (this.hasProducts(this.currentCode)) {
      this.showToast('No se puede eliminar una categoría con productos asociados', 'error');
      this.closeDeleteModal();
      return;
    }

    this.categoryService.deleteCategory(this.currentCode);

    this.showToast('Categoría eliminada correctamente', 'success');

    this.closeDeleteModal();
  }

  // -------------------------
  // UTIL
  // -------------------------
  resetForm(): void {
    this.newCategory = '';
    this.currentCode = '';
    this.isEditing = false;
    this.formErrors.name = '';
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  clearNameError(): void {
    this.formErrors.name = '';
  }

  // -------------------------
  // CODE GENERATOR
  // -------------------------
  generateCategoryCode(): string {
    if (this.categories.length === 0) {
      return 'C001';
    }

    const last = this.categories[this.categories.length - 1];
    const number = parseInt(last.code.replace('C', ''));

    return 'C' + (number + 1).toString().padStart(3, '0');
  }
}
