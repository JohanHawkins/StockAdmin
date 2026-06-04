import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesComponent {
  formErrors = {
    name: '',
  };

  clearNameError(): void {
    this.formErrors.name = '';
  }

  previewCode = '';

  searchTerm = '';

  categories: Category[] = [];

  newCategory = '';

  isEditing = false;

  currentIndex = -1;

  showModal = false;

  showDeleteModal = false;

  toastVisible = false;

  toastMessage = '';

  toastType: 'success' | 'error' = 'success';

  constructor(private categoryService: CategoryService) {
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
  // MODAL CREATE / EDIT
  // -------------------------
  openModal(): void {
    this.showModal = true;
    this.isEditing = false;
    this.newCategory = '';

    this.previewCode = this.generateCategoryCode();
  }

  closeModal(): void {
    this.showModal = false;
  }

  editCategory(category: Category, index: number): void {
    this.newCategory = category.name;
    this.currentIndex = index;
    this.isEditing = true;
    this.showModal = true;

    this.previewCode = category.code;
  }

  addCategory(): void {
    if (!this.newCategory.trim()) {
      this.formErrors.name = 'El nombre es obligatorio';
      this.showToast('El nombre es obligatorio', 'error');
      return;
    }

    const categoryName = this.newCategory.trim();

    const exists = this.categories.some((c) => c.name.toLowerCase() === categoryName.toLowerCase());

    if (!this.isEditing && exists) {
      this.formErrors.name = 'La categoría ya existe';
      this.showToast('La categoría ya existe', 'error');
      return;
    }

    if (this.isEditing) {
      this.categoryService.updateCategory(this.currentIndex, {
        ...this.categories[this.currentIndex],
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
  // DELETE MODAL
  // -------------------------
  openDeleteModal(index: number): void {
    this.currentIndex = index;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.categoryService.deleteCategory(this.currentIndex);

    this.showToast('Categoría eliminada correctamente', 'success');

    this.closeDeleteModal();
  }

  // -------------------------
  // UTIL
  // -------------------------
  resetForm(): void {
    this.newCategory = '';
    this.currentIndex = -1;
    this.isEditing = false;
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  generateCategoryCode(): string {
    if (this.categories.length === 0) {
      return 'C001';
    }

    const last = this.categories[this.categories.length - 1];
    const number = parseInt(last.code.replace('C', ''));

    return 'C' + (number + 1).toString().padStart(3, '0');
  }
}
