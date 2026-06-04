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
  categories: Category[] = [];

  newCategory = '';

  constructor(private categoryService: CategoryService) {
    this.categories = this.categoryService.getCategories();
  }

  addCategory(): void {
    if (!this.newCategory.trim()) {
      return;
    }

    const category: Category = {
      id: Date.now(),

      name: this.newCategory.trim(),
    };

    this.categoryService.addCategory(category);

    this.newCategory = '';
  }
}
