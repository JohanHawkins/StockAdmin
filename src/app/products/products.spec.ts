import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';
import { Product } from '../models/product.model';

const PRODUCTS: Product[] = [
  {
    code: 'P001',
    name: 'Teclado',
    description: '',
    price: 120000,
    stock: 5,
    minStock: 2,
    categoryCode: 'C001',
    status: 'Activo',
  },
  {
    code: 'P010',
    name: 'Mouse',
    description: '',
    price: 80000,
    stock: 1,
    minStock: 3,
    categoryCode: 'C001',
    status: 'Inactivo',
  },
  {
    code: 'X001',
    name: 'Otro',
    description: '',
    price: 100,
    stock: 1,
    minStock: 1,
    categoryCode: 'C002',
    status: 'Activo',
  },
];

describe('ProductsComponent', () => {
  let fixture: ComponentFixture<ProductsComponent>;
  let component: ProductsComponent;
  const productService = {
    getProducts: vi.fn(),
    addProduct: vi.fn(),
    importProducts: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
    toggleStatus: vi.fn(),
  };
  const categoryService = { getCategories: vi.fn() };
  const authService = { isAdmin: vi.fn(() => true), getCurrentUser: vi.fn(() => null) };

  beforeEach(async () => {
    vi.clearAllMocks();
    productService.getProducts.mockReturnValue(of(PRODUCTS));
    categoryService.getCategories.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: CategoryService, useValue: categoryService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('generateProductCode usa el mayor P### más 1', () => {
    expect(component.generateProductCode()).toBe('P011');
  });

  it('generateProductCode con lista vacía devuelve P001', () => {
    component.products = [];
    expect(component.generateProductCode()).toBe('P001');
  });

  it('generateProductCode ignora códigos sin formato P###', () => {
    component.products = [PRODUCTS[2]];
    expect(component.generateProductCode()).toBe('P001');
  });

  it('saveProduct valida código vacío', () => {
    component.newProduct = { ...component.newProduct, code: '', name: 'Nuevo' };
    component.saveProduct();
    expect(component.formErrors.code).toBe('El código es obligatorio');
    expect(productService.addProduct).not.toHaveBeenCalled();
  });

  it('saveProduct detecta nombre duplicado', () => {
    component.newProduct = { ...PRODUCTS[0], name: 'mouse' };
    component.currentCode = 'P001';
    component.saveProduct();
    expect(component.formErrors.name).toBe('Ya existe un producto con este nombre');
    expect(productService.addProduct).not.toHaveBeenCalled();
  });

  it('exportCSV sin productos muestra error', () => {
    component.products = [];
    component.exportCSV();
    expect(component.toastMessage).toBe('No hay productos para exportar');
    expect(component.toastType).toBe('error');
    expect(component.toastVisible).toBe(true);
  });

  it('filtra por término en nombre o código', () => {
    component.searchTerm = 'tec';
    expect(component.filteredProducts.map((p) => p.code)).toEqual(['P001']);
    expect(component.hasActiveFilters).toBe(true);
  });

  it('filtra por stock bajo (stock <= minStock)', () => {
    component.filterLowStock = true;
    expect(component.filteredProducts.map((p) => p.code)).toEqual(['P010', 'X001']);
  });

  it('ordena por precio descendente', () => {
    component.sortBy('price');
    component.sortBy('price');
    expect(component.filteredProducts.map((p) => p.code)).toEqual(['P001', 'P010', 'X001']);
  });
});
