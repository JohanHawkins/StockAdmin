import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ImportResult } from '../models/product.model';

const PRODUCT: Product = {
  code: 'P001',
  name: 'Teclado',
  description: '',
  price: 120000,
  stock: 5,
  minStock: 2,
  categoryCode: 'C001',
  status: 'Activo',
};

describe('ProductService', () => {
  let service: ProductService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductService);
    http = TestBed.inject(HttpTestingController);
  });

  it('getProducts convierte price, stock y minStock a números', () => {
    let result: Product[] = [];
    service.getProducts().subscribe((r) => (result = r));

    const req = http.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush([{ ...PRODUCT, price: '120000', stock: '5', minStock: '2' }]);

    expect(result[0].price).toBe(120000);
    expect(result[0].stock).toBe(5);
    expect(result[0].minStock).toBe(2);
    expect(result[0].status).toBe('Activo');
    http.verify();
  });

  it('addProduct hace POST al endpoint de productos', () => {
    service.addProduct(PRODUCT).subscribe();
    const req = http.expectOne('/api/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(PRODUCT);
    req.flush(PRODUCT);
    http.verify();
  });

  it('importProducts hace POST a /import con la lista de productos', () => {
    let result: ImportResult | undefined;
    service.importProducts([PRODUCT]).subscribe((r) => (result = r));
    const req = http.expectOne('/api/products/import');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ products: [PRODUCT] });
    req.flush({ created: 1, createdCodes: ['P001'], skipped: 0, skippedCodes: [], errors: [] });
    expect(result?.created).toBe(1);
    expect(result?.createdCodes).toEqual(['P001']);
    http.verify();
  });

  it('updateProduct hace PUT a /:code', () => {
    service.updateProduct('P001', PRODUCT).subscribe();
    const req = http.expectOne('/api/products/P001');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(PRODUCT);
    req.flush(PRODUCT);
    http.verify();
  });

  it('deleteProduct hace DELETE a /:code', () => {
    service.deleteProduct('P001').subscribe();
    const req = http.expectOne('/api/products/P001');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    http.verify();
  });

  it('toggleStatus hace PATCH a /:code/toggle-status', () => {
    service.toggleStatus('P001').subscribe();
    const req = http.expectOne('/api/products/P001/toggle-status');
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...PRODUCT, status: 'Inactivo' });
    http.verify();
  });
});
