import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product, ImportResult } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API_URL = '/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      map((products) =>
        products.map((p) => ({
          ...p,
          price: Number(p.price),
          stock: Number(p.stock),
          minStock: Number(p.minStock),
        })),
      ),
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product);
  }

  importProducts(products: Product[]): Observable<ImportResult> {
    return this.http.post<ImportResult>(`${this.API_URL}/import`, { products });
  }

  updateProduct(code: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${code}`, product);
  }

  deleteProduct(code: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${code}`);
  }

  toggleStatus(code: string): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${code}/toggle-status`, {});
  }
}
