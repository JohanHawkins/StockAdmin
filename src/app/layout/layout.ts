import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SpinnerComponent } from '../shared/spinner/spinner';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SpinnerComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class LayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;
  isMobile = false;
  showMobileMenu = false;
  isDarkMode = false;
  isNavigating = false;

  private routerSub!: Subscription;

  constructor(public authService: AuthService, private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit(): void {
    this.loadTheme();
    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationStart || e instanceof NavigationEnd),
    ).subscribe(e => {
      this.isNavigating = e instanceof NavigationStart;
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.sidebarCollapsed = false;
      this.showMobileMenu = false;
    }
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode = true;
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this.isDarkMode = false;
      document.documentElement.removeAttribute('data-theme');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;

    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleSidebar(): void {
    if (this.isMobile) {
      this.showMobileMenu = !this.showMobileMenu;
    } else {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    }
  }

  closeMobileMenu(): void {
    if (this.isMobile) {
      this.showMobileMenu = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
