import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard';
import { ProductsComponent } from './products/products';
import { CategoriesComponent } from './categories/categories';
import { MovementsComponent } from './movements/movements';

export const routes: Routes = [
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
];
