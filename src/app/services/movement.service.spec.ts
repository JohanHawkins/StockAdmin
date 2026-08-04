import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MovementService } from './movement.service';
import { Movement } from '../models/movement.model';

const MOVEMENT: Movement = {
  code: 'M001',
  productCode: 'P001',
  type: 'ENTRADA',
  quantity: 5,
  date: new Date('2026-01-01'),
  observation: '',
};

describe('MovementService', () => {
  let service: MovementService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovementService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovementService);
    http = TestBed.inject(HttpTestingController);
  });

  it('getMovements hace GET al endpoint de movimientos', () => {
    let result: Movement[] = [];
    service.getMovements().subscribe((r) => (result = r));
    const req = http.expectOne('/api/movements');
    expect(req.request.method).toBe('GET');
    req.flush([MOVEMENT]);
    expect(result).toEqual([MOVEMENT]);
    http.verify();
  });

  it('addMovement hace POST con el movimiento', () => {
    service.addMovement(MOVEMENT).subscribe();
    const req = http.expectOne('/api/movements');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(MOVEMENT);
    req.flush(MOVEMENT);
    http.verify();
  });

  it('generateCode hace GET a /generate-code', () => {
    let result: { code: string } | undefined;
    service.generateCode().subscribe((r) => (result = r));
    const req = http.expectOne('/api/movements/generate-code');
    expect(req.request.method).toBe('GET');
    req.flush({ code: 'M002' });
    expect(result).toEqual({ code: 'M002' });
    http.verify();
  });
});
