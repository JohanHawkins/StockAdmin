import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../shared/toast/toast';
import { MovementService } from '../services/movement.service';
import { ProductService } from '../services/product.service';
import { AuthService } from '../services/auth.service';
import { Movement } from '../models/movement.model';
import { Product } from '../models/product.model';
import { serializeCSV } from '../shared/csv';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './movements.html',
  styleUrl: './movements.css',
})
export class MovementsComponent implements OnInit {
  showModal = false;

  toastVisible = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  formErrors = {
    productCode: '',
    type: '',
    quantity: '',
  };

  movements: Movement[] = [];
  products: Product[] = [];

  filterType = '';
  filterProductCode = '';
  filterDateFrom = '';
  filterDateTo = '';

  newMovement: Movement = {
    code: '',
    productCode: '',
    type: '' as any,
    quantity: 0,
    date: new Date(),
    observation: '',
  };

  constructor(
    private movementService: MovementService,
    private productService: ProductService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.movementService.getMovements().subscribe((movements) => {
      this.movements = movements;
      this.cdr.detectChanges();
    });
    this.productService.getProducts().subscribe((products) => {
      this.products = products;
      this.cdr.detectChanges();
    });
  }

  openModal(): void {
    this.resetForm();
    this.generateNewCode();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  generateNewCode(): void {
    this.movementService.generateCode().subscribe({
      next: (response) => {
        this.newMovement.code = response.code;
      },
    });
  }

  getProductName(productCode: string): string {
    const product = this.products.find((p) => p.code === productCode);
    return product?.name ?? productCode;
  }

  getSelectedProduct(): Product | undefined {
    return this.products.find((p) => p.code === this.newMovement.productCode);
  }

  addMovement(): void {
    this.clearErrors();

    if (!this.newMovement.productCode) {
      this.formErrors.productCode = 'Debe seleccionar un producto';
      this.showToast('Debe seleccionar un producto', 'error');
      return;
    }

    if (!this.newMovement.type) {
      this.formErrors.type = 'Debe seleccionar un tipo de movimiento';
      this.showToast('Debe seleccionar un tipo de movimiento', 'error');
      return;
    }

    if (this.newMovement.quantity <= 0) {
      this.formErrors.quantity = 'La cantidad debe ser mayor a 0';
      this.showToast('La cantidad debe ser mayor a 0', 'error');
      return;
    }

    this.newMovement.date = new Date();

    this.movementService.addMovement(this.newMovement).subscribe({
      next: () => {
        this.showToast('Movimiento registrado correctamente', 'success');
        this.closeModal();
        this.resetForm();
        this.loadData();
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showToast(error.error?.error || 'Error al registrar movimiento', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  resetForm(): void {
    this.newMovement = {
      code: '',
      productCode: '',
      type: '' as any,
      quantity: 0,
      date: new Date(),
      observation: '',
    };
    this.clearErrors();
  }

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.toastVisible = true;

    setTimeout(() => {
      this.toastVisible = false;
    }, 3000);
  }

  clearProductError(): void {
    this.formErrors.productCode = '';
  }

  clearTypeError(): void {
    this.formErrors.type = '';
  }

  clearQuantityError(): void {
    this.formErrors.quantity = '';
  }

  clearErrors(): void {
    this.formErrors = {
      productCode: '',
      type: '',
      quantity: '',
    };
  }

  get filteredMovements(): Movement[] {
    return this.movements.filter((m) => {
      if (this.filterType && m.type !== this.filterType) return false;
      if (this.filterProductCode && m.productCode !== this.filterProductCode) return false;

      const movementDate = new Date(m.date);

      if (this.filterDateFrom) {
        const from = new Date(this.filterDateFrom);
        if (movementDate < from) return false;
      }

      if (this.filterDateTo) {
        const to = new Date(this.filterDateTo);
        to.setHours(23, 59, 59, 999);
        if (movementDate > to) return false;
      }

      return true;
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.filterProductCode = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
  }

  exportCSV(): void {
    const rows = this.filteredMovements;

    if (rows.length === 0) {
      this.showToast('No hay movimientos para exportar', 'error');
      return;
    }

    const headers = ['code', 'productName', 'productCode', 'type', 'quantity', 'observation', 'date'];
    const data = rows.map((m) => [
      m.code,
      this.getProductName(m.productCode),
      m.productCode,
      m.type,
      m.quantity,
      m.observation || '',
      this.formatDate(m.date),
    ]);

    const csv = serializeCSV(headers, data);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `movimientos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    this.showToast(`Se exportaron ${rows.length} movimientos`, 'success');
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
}
