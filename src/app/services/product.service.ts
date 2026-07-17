import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly API_URL = '/api/products';
  private products: Product[] = [];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_URL).pipe(
      tap((products) => {
        this.products = products;
      }),
    );
  }

  getProduct(code: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${code}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API_URL, product).pipe(
      tap((newProduct) => {
        this.products.push(newProduct);
      }),
    );
  }

  updateProduct(code: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${code}`, product).pipe(
      tap((updatedProduct) => {
        const index = this.products.findIndex((p) => p.code === code);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
      }),
    );
  }

  deleteProduct(code: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${code}`).pipe(
      tap(() => {
        this.products = this.products.filter((p) => p.code !== code);
      }),
    );
  }

  toggleStatus(code: string): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/${code}/toggle-status`, {}).pipe(
      tap((updatedProduct) => {
        const index = this.products.findIndex((p) => p.code === code);
        if (index !== -1) {
          this.products[index].status = updatedProduct.status;
        }
      }),
    );
  }

  getLocalProducts(): Product[] {
    return this.products;
  }
}
