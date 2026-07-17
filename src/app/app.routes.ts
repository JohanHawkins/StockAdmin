import { Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { ProductsComponent } from './products/products';
import { CategoriesComponent } from './categories/categories';
import { MovementsComponent } from './movements/movements';
import { NotFoundComponent } from './not-found/not-found';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'products',
        component: ProductsComponent,
      },

      {
        path: 'categories',
        component: CategoriesComponent,
      },

      {
        path: 'movements',
        component: MovementsComponent,
      },
    ],
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];
