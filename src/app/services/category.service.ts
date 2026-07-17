import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly API_URL = '/api/categories';
  private categories: Category[] = [];

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL).pipe(
      tap((categories) => {
        this.categories = categories;
      }),
    );
  }

  getCategory(code: string): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/${code}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.API_URL, category).pipe(
      tap((newCategory) => {
        this.categories.push(newCategory);
      }),
    );
  }

  updateCategory(code: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/${code}`, category).pipe(
      tap((updatedCategory) => {
        const index = this.categories.findIndex((c) => c.code === code);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
      }),
    );
  }

  deleteCategory(code: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${code}`).pipe(
      tap(() => {
        this.categories = this.categories.filter((c) => c.code !== code);
      }),
    );
  }

  getLocalCategories(): Category[] {
    return this.categories;
  }
}
