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
  generateCategoryCode(): string {
    if (this.categories.length === 0) {
      return 'C001';
    }

    const lastCategory = this.categories[this.categories.length - 1];

    const lastCodeNumber = parseInt(lastCategory.code.replace('C', ''));

    const nextNumber = lastCodeNumber + 1;

    return 'C' + nextNumber.toString().padStart(3, '0');
  }
  categories: Category[] = [];

  newCategory = '';

  isEditing = false;

  currentIndex = -1;

  constructor(private categoryService: CategoryService) {
    this.categories = this.categoryService.getCategories();
  }

  addCategory(): void {
    if (!this.newCategory.trim()) {
      return;
    }
    const categoryName = this.newCategory.trim();

    const categoryExists = this.categories.some(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase(),
    );

    if (!this.isEditing && categoryExists) {
      alert('La categoría ya existe');

      return;
    }

    if (this.isEditing) {
      this.categoryService.updateCategory(this.currentIndex, {
        ...this.categories[this.currentIndex],
        name: this.newCategory.trim(),
      });
    } else {
      const category: Category = {
        code: this.generateCategoryCode(),

        name: this.newCategory.trim(),
      };

      this.categoryService.addCategory(category);
    }

    this.resetForm();
  }
  editCategory(category: Category, index: number): void {
    this.newCategory = category.name;

    this.currentIndex = index;

    this.isEditing = true;
  }
  deleteCategory(index: number): void {
    this.categoryService.deleteCategory(index);

    this.resetForm();
  }
  resetForm(): void {
    this.newCategory = '';

    this.currentIndex = -1;

    this.isEditing = false;
  }
}
