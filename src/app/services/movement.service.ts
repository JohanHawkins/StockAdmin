import { Injectable } from '@angular/core';
import { Movement } from '../models/movement.model';

@Injectable({
  providedIn: 'root',
})
export class MovementService {
  private storageKey = 'movements';

  private movements: Movement[] = [];

  constructor() {
    this.load();
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private load(): void {
    if (!this.isBrowser()) {
      this.movements = [];
      return;
    }

    const data = localStorage.getItem(this.storageKey);

    if (data) {
      const parsedMovements: Movement[] = JSON.parse(data);

      this.movements = parsedMovements.map((movement) => ({
        ...movement,
        date: new Date(movement.date),
      }));
    }
  }

  private save(): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(this.storageKey, JSON.stringify(this.movements));
  }

  getMovements(): Movement[] {
    return this.movements;
  }

  addMovement(movement: Movement): void {
    this.movements.push(movement);

    this.save();
  }

  generateId(): string {
    if (this.movements.length === 0) return 'M001';

    const last = this.movements[this.movements.length - 1];

    const number = parseInt(last.id.replace('M', ''));

    return 'M' + (number + 1).toString().padStart(3, '0');
  }
}
