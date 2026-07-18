import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../shared/toast/toast';
import { ProductService } from '../services/product.service';
import { MovementService } from '../services/movement.service';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class ProductsComponent implements OnInit {
  searchTerm = '';

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  showModal = false;
  showDeleteModal = false;
  showStatusModal = false;

  isEditing = false;
  currentCode = '';

  products: Product[] = [];
  categories: Category[] = [];

  currentPage = 1;
  itemsPerPage = 10;

  sortColumn: keyof Product = 'code';
  sortDirection: 'asc' | 'desc' = 'asc';

  newProduct: Product = {
    code: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    minStock: 0,
    categoryCode: '',
    status: 'Activo',
  };

  formErrors = {
    code: '',
    name: '',
    price: '',
    stock: '',
    minStock: '',
    categoryCode: '',
  };

  constructor(
    private productService: ProductService,
    private movementService: MovementService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.cdr.detectChanges();
    });
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.cdr.detectChanges();
    });
  }

  showToast(message: string, type: 'success' | 'error' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  openModal() {
    this.clearErrors();
    this.newProduct = {
      code: this.generateProductCode(),
      name: '',
      description: '',
      price: 0,
      stock: 0,
      minStock: 0,
      categoryCode: '',
      status: 'Activo',
    };
    this.isEditing = false;
    this.showModal = true;
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

    if (!this.newProduct.categoryCode) {
      this.formErrors.categoryCode = 'Debe seleccionar una categoría';
      this.showToast('Debe seleccionar una categoría', 'error');
      return;
    }

    if (this.newProduct.price <= 0) {
      this.formErrors.price = 'El precio debe ser un valor mayor a 0';
      this.showToast('El precio debe ser un valor mayor a 0', 'error');
      return;
    }

    if (this.newProduct.stock < 0 || !Number.isInteger(this.newProduct.stock)) {
      this.formErrors.stock = 'El stock debe ser un valor mayor o igual a 0';
      this.showToast('El stock debe ser un valor mayor o igual a 0', 'error');
      return;
    }

    if (this.newProduct.minStock < 0 || !Number.isInteger(this.newProduct.minStock)) {
      this.formErrors.minStock = 'El stock mínimo debe ser un valor mayor o igual a 0';
      this.showToast('El stock mínimo debe ser un valor mayor o igual a 0', 'error');
      return;
    }

    const wasEditing = this.isEditing;

    if (this.isEditing) {
      this.productService.updateProduct(this.currentCode, { ...this.newProduct }).subscribe({
        next: () => {
          this.resetForm();
          this.showToast('Producto actualizado correctamente', 'success');
          this.closeModal();
          this.loadData();
          this.cdr.detectChanges();
        },
        error: () => {
          this.showToast('Error al actualizar producto', 'error');
          this.cdr.detectChanges();
        },
      });
    } else {
      this.productService.addProduct({ ...this.newProduct }).subscribe({
        next: () => {
          this.resetForm();
          this.showToast('Producto creado correctamente', 'success');
          this.closeModal();
          this.loadData();
          this.cdr.detectChanges();
        },
        error: () => {
          this.showToast('Error al crear producto', 'error');
          this.cdr.detectChanges();
        },
      });
    }
  }

  editProduct(product: Product) {
    this.newProduct = { ...product };
    this.currentCode = product.code;
    this.isEditing = true;
    this.showModal = true;
  }

  openDeleteModal(code: string) {
    this.currentCode = code;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  openStatusModal(code: string) {
    this.currentCode = code;
    this.showStatusModal = true;
  }

  closeStatusModal() {
    this.showStatusModal = false;
  }

  confirmToggleStatus() {
    this.productService.toggleStatus(this.currentCode).subscribe({
      next: (updatedProduct) => {
        this.showToast(`Producto cambiado a ${updatedProduct.status}`, 'success');
        this.closeStatusModal();
        this.loadData();
        this.cdr.detectChanges();
      },
      error: () => {
        this.showToast('Error al cambiar estado', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  confirmDelete() {
    this.productService.deleteProduct(this.currentCode).subscribe({
      next: () => {
        this.showToast('Producto eliminado correctamente', 'success');
        this.closeDeleteModal();
        this.loadData();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showToast(error.error?.error || 'Error al eliminar producto', 'error');
        this.closeDeleteModal();
        this.cdr.detectChanges();
      },
    });
  }

  resetForm() {
    this.newProduct = {
      code: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      minStock: 0,
      categoryCode: '',
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
      minStock: '',
      categoryCode: '',
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

  clearMinStockError() {
    this.formErrors.minStock = '';
  }

  getCategoryName(code: string): string {
    const category = this.categories.find((c) => c.code === code);
    return category?.name ?? code;
  }

  generateProductCode(): string {
    if (this.products.length === 0) return 'P001';

    const lastProduct = this.products[this.products.length - 1];
    const lastCodeNumber = parseInt(lastProduct.code.replace('P', ''));
    return 'P' + (lastCodeNumber + 1).toString().padStart(3, '0');
  }

  sortBy(column: keyof Product): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getSortIcon(column: keyof Product): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? '\u2191' : '\u2193';
  }

  get filteredProducts(): Product[] {
    const filtered = this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );

    filtered.sort((a, b) => {
      const aVal = a[this.sortColumn];
      const bVal = b[this.sortColumn];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return this.sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return this.sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalFilteredProducts(): number {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()),
    ).length;
  }

  get totalPages(): number {
    return Math.ceil(this.totalFilteredProducts / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  get selectedProduct(): Product | null {
    if (!this.currentCode) return null;
    return this.products.find((p) => p.code === this.currentCode) ?? null;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
