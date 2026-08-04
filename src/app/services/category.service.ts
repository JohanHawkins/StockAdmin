import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly API_URL = '/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.API_URL);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.API_URL, category);
  }

  updateCategory(code: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/${code}`, category);
  }

  deleteCategory(code: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${code}`);
  }
}
