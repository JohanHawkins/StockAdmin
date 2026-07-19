import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, catchError, of } from 'rxjs';

export interface SessionUser {
  id: number;
  nombre: string;
  email: string;
  role: 'admin' | 'empleado';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly SESSION_KEY = 'stockadmin_session';
  private readonly API_URL = '/api/auth';

  private currentUser: SessionUser | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private http: HttpClient,
  ) {
    this.loadSession();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadSession(): void {
    if (!this.isBrowser()) return;

    const session = localStorage.getItem(this.SESSION_KEY);
    if (session) {
      this.currentUser = JSON.parse(session);
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<SessionUser>(`${this.API_URL}/login`, { email, password }).pipe(
      tap((user) => {
        this.currentUser = user;
        if (this.isBrowser()) {
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        }
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }

  logout(): void {
    this.currentUser = null;
    if (this.isBrowser()) {
      localStorage.removeItem(this.SESSION_KEY);
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): SessionUser | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

}
