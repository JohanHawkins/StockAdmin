import { Component } from '@angular/core';
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
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Email o contraseña incorrectos';
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Error de conexión con el servidor';
        this.isLoading = false;
      },
    });
  }
}
