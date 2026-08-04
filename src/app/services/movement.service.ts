import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movement } from '../models/movement.model';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private readonly API_URL = '/api/movements';

  constructor(private http: HttpClient) {}

  getMovements(): Observable<Movement[]> {
    return this.http.get<Movement[]>(this.API_URL);
  }

  addMovement(movement: Movement): Observable<Movement> {
    return this.http.post<Movement>(this.API_URL, movement);
  }

  generateCode(): Observable<{ code: string }> {
    return this.http.get<{ code: string }>(`${this.API_URL}/generate-code`);
  }
}
