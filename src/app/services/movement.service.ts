import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Movement } from '../models/movement.model';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private readonly API_URL = '/api/movements';
  private movements: Movement[] = [];

  constructor(private http: HttpClient) {}

  getMovements(): Observable<Movement[]> {
    return this.http.get<Movement[]>(this.API_URL).pipe(
      tap((movements) => {
        this.movements = movements;
      }),
    );
  }

  getMovement(code: string): Observable<Movement> {
    return this.http.get<Movement>(`${this.API_URL}/${code}`);
  }

  addMovement(movement: Movement): Observable<Movement> {
    return this.http.post<Movement>(this.API_URL, movement).pipe(
      tap((newMovement) => {
        this.movements.unshift(newMovement);
      }),
    );
  }

  generateCode(): Observable<{ code: string }> {
    return this.http.get<{ code: string }>(`${this.API_URL}/generate-code`);
  }

  getLocalMovements(): Movement[] {
    return this.movements;
  }
}
