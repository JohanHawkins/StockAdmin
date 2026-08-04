import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.cdr.detectChanges();

    if (!this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        if (result === true) {
          this.router.navigate(['/dashboard']);
        } else {
          this.isLoading = false;
          this.errorMessage =
            result === false ? 'Email o contraseña incorrectos' : 'Error de conexión con el servidor';
          this.cdr.detectChanges();
        }
      },
    });
  }
}
