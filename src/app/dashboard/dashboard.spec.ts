import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { MovementService } from '../services/movement.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Movement } from '../models/movement.model';

const PRODUCTS: Product[] = [
  {
    code: 'P001',
    name: 'Teclado',
    description: '',
    price: 120000,
    stock: 10,
    minStock: 2,
    categoryCode: 'C001',
    status: 'Activo',
  },
  {
    code: 'P002',
    name: 'Mouse',
    description: '',
    price: 50000,
    stock: 5,
    minStock: 8,
    categoryCode: 'C001',
    status: 'Inactivo',
  },
];

const CATEGORIES: Category[] = [{ code: 'C001', name: 'Electrónica' }];

const MOVEMENTS: Movement[] = [
  {
    code: 'M001',
    productCode: 'P001',
    type: 'ENTRADA',
    quantity: 5,
    date: new Date('2026-01-02T10:00:00'),
    observation: '',
  },
  {
    code: 'M002',
    productCode: 'P002',
    type: 'SALIDA',
    quantity: 2,
    date: new Date('2026-01-01T10:00:00'),
    observation: '',
  },
];

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  const productService = { getProducts: vi.fn() };
  const categoryService = { getCategories: vi.fn() };
  const movementService = { getMovements: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    productService.getProducts.mockReturnValue(of(PRODUCTS));
    categoryService.getCategories.mockReturnValue(of(CATEGORIES));
    movementService.getMovements.mockReturnValue(of(MOVEMENTS));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: CategoryService, useValue: categoryService },
        { provide: MovementService, useValue: movementService },
        { provide: Router, useValue: { events: of() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calcula totales, stock e inventario', () => {
    expect(component.totalProducts).toBe(2);
    expect(component.totalCategories).toBe(1);
    expect(component.totalMovements).toBe(2);
    expect(component.totalStock).toBe(15);
    expect(component.inventoryValue).toBe(120000 * 10 + 50000 * 5);
    expect(component.isLoading).toBe(false);
  });

  it('cuenta solo productos activos', () => {
    expect(component.activeProducts).toBe(1);
  });

  it('identifica el producto con más stock y el más caro', () => {
    expect(component.highestStockProduct?.code).toBe('P001');
    expect(component.mostExpensiveProduct?.code).toBe('P001');
  });

  it('identifica productos con stock bajo', () => {
    expect(component.lowStockProducts.map((p) => p.code)).toEqual(['P002']);
  });

  it('toma el último movimiento como el más reciente', () => {
    expect(component.lastMovement?.code).toBe('M001');
  });

  it('resuelve nombres de producto y categoría', () => {
    expect(component.getProductName('P001')).toBe('Teclado');
    expect(component.getCategoryName('C001')).toBe('Electrónica');
    expect(component.getProductName('P999')).toBe('P999');
  });

  it('al fallar la carga detiene el indicador de carga', () => {
    vi.clearAllMocks();
    productService.getProducts.mockReturnValue(of([]));
    categoryService.getCategories.mockReturnValue(of([]));
    movementService.getMovements.mockReturnValue(of([]));
    component.loadData();
    expect(component.isLoading).toBe(false);
  });
});
