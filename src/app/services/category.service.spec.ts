import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../models/category.model';

const CATEGORY: Category = { code: 'C001', name: 'Electrónica' };

describe('CategoryService', () => {
  let service: CategoryService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CategoryService);
    http = TestBed.inject(HttpTestingController);
  });

  it('getCategories hace GET al endpoint de categorías', () => {
    let result: Category[] = [];
    service.getCategories().subscribe((r) => (result = r));
    const req = http.expectOne('/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush([CATEGORY]);
    expect(result).toEqual([CATEGORY]);
    http.verify();
  });

  it('addCategory hace POST con la categoría', () => {
    service.addCategory(CATEGORY).subscribe();
    const req = http.expectOne('/api/categories');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(CATEGORY);
    req.flush(CATEGORY);
    http.verify();
  });

  it('updateCategory hace PUT a /:code', () => {
    service.updateCategory('C001', CATEGORY).subscribe();
    const req = http.expectOne('/api/categories/C001');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(CATEGORY);
    req.flush(CATEGORY);
    http.verify();
  });

  it('deleteCategory hace DELETE a /:code', () => {
    service.deleteCategory('C001').subscribe();
    const req = http.expectOne('/api/categories/C001');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    http.verify();
  });
});
