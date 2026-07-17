import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

export interface SessionUser {
  id: number;
  nombre: string;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USERS_KEY = 'stockadmin_users';
  private readonly SESSION_KEY = 'stockadmin_session';

  private defaultUsers: User[] = [
    {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@admin.com',
      password: '123456',
      role: 'admin',
    },
    {
      id: 2,
      nombre: 'Usuario',
      email: 'user@user.com',
      password: '123456',
      role: 'user',
    },
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {
    this.initUsers();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initUsers(): void {
    if (!this.isBrowser()) return;

    const users = localStorage.getItem(this.USERS_KEY);

    if (!users) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(this.defaultUsers));
    }
  }

  login(email: string, password: string): boolean {
    if (!this.isBrowser()) return false;

    const users = this.getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (user) {
      localStorage.setItem(
        this.SESSION_KEY,
        JSON.stringify({ id: user.id, nombre: user.nombre, email: user.email, role: user.role }),
      );
      return true;
    }

    return false;
  }

  logout(): void {
    if (!this.isBrowser()) return;

    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) return false;

    return localStorage.getItem(this.SESSION_KEY) !== null;
  }

  getCurrentUser(): SessionUser | null {
    if (!this.isBrowser()) return null;

    const session = localStorage.getItem(this.SESSION_KEY);

    return session ? JSON.parse(session) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isUser(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'user';
  }

  private getUsers(): User[] {
    if (!this.isBrowser()) return this.defaultUsers;

    const users = localStorage.getItem(this.USERS_KEY);

    return users ? JSON.parse(users) : this.defaultUsers;
  }
}
