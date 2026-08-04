import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, SessionUser } from './auth.service';

const navigate = vi.fn();
const USER: SessionUser = { id: 1, nombre: 'Admin', email: 'admin@admin.com', role: 'admin' };

describe('AuthService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    navigate.mockReset();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigate } },
      ],
    });

    http = TestBed.inject(HttpTestingController);
  });

  const setup = () => TestBed.inject(AuthService);

  it('login exitoso devuelve true y guarda sesión', () => {
    const service = setup();
    let result: boolean | null | undefined;
    service.login('admin@admin.com', '123456').subscribe((r) => (result = r));

    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'admin@admin.com', password: '123456' });
    req.flush(USER);

    expect(result).toBe(true);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getCurrentUser()).toEqual(USER);
    expect(JSON.parse(localStorage.getItem('stockadmin_session') ?? 'null')).toEqual(USER);
    http.verify();
  });

  it('login con 401 devuelve false (credenciales incorrectas)', () => {
    const service = setup();
    let result: boolean | null | undefined;
    service.login('a@a.com', 'x').subscribe((r) => (result = r));
    http.expectOne('/api/auth/login').flush({ error: 'Credenciales incorrectas' }, {
      status: 401,
      statusText: 'Unauthorized',
    });
    expect(result).toBe(false);
    expect(service.isLoggedIn()).toBe(false);
    http.verify();
  });

  it('login con 400 devuelve false', () => {
    const service = setup();
    let result: boolean | null | undefined;
    service.login('', '').subscribe((r) => (result = r));
    http.expectOne('/api/auth/login').flush({ error: 'obligatorios' }, {
      status: 400,
      statusText: 'Bad Request',
    });
    expect(result).toBe(false);
    http.verify();
  });

  it('login con error de red devuelve null', () => {
    const service = setup();
    let result: boolean | null | undefined;
    service.login('a@a.com', 'x').subscribe((r) => (result = r));
    http.expectOne('/api/auth/login').error(new ProgressEvent('error'));
    expect(result).toBeNull();
    http.verify();
  });

  it('login con error 500 devuelve null', () => {
    const service = setup();
    let result: boolean | null | undefined;
    service.login('a@a.com', 'x').subscribe((r) => (result = r));
    http.expectOne('/api/auth/login').flush({ error: 'Error interno' }, {
      status: 500,
      statusText: 'Server Error',
    });
    expect(result).toBeNull();
    http.verify();
  });

  it('recupera la sesión guardada en localStorage al construirse', () => {
    localStorage.setItem('stockadmin_session', JSON.stringify(USER));
    const service = setup();
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getCurrentUser()).toEqual(USER);
    expect(service.isAdmin()).toBe(true);
  });

  it('sin sesión no está logueado ni es admin', () => {
    const service = setup();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.isAdmin()).toBe(false);
    expect(service.getCurrentUser()).toBeNull();
  });

  it('logout limpia la sesión y navega a /login', () => {
    localStorage.setItem('stockadmin_session', JSON.stringify(USER));
    const service = setup();
    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('stockadmin_session')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
