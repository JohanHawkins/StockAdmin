import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  const authService = { login: vi.fn() };
  const router = { navigate: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('con campos vacíos muestra mensaje de obligatorios y no llama al servicio', () => {
    component.email = '';
    component.password = '';
    component.onSubmit();

    expect(component.errorMessage).toBe('Todos los campos son obligatorios');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('login correcto navega a /dashboard', () => {
    authService.login.mockReturnValue(of(true));
    component.email = 'admin@admin.com';
    component.password = '123456';
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('credenciales incorrectas muestra error y deja de cargar', () => {
    authService.login.mockReturnValue(of(false));
    component.email = 'a@a.com';
    component.password = 'x';
    component.onSubmit();

    expect(component.errorMessage).toBe('Email o contraseña incorrectos');
    expect(component.isLoading).toBe(false);
  });

  it('error de conexión muestra mensaje de servidor', () => {
    authService.login.mockReturnValue(of(null));
    component.email = 'a@a.com';
    component.password = 'x';
    component.onSubmit();

    expect(component.errorMessage).toBe('Error de conexión con el servidor');
    expect(component.isLoading).toBe(false);
  });
});
