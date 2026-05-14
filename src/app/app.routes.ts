import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard';
import { ProductsComponent } from './products/products';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path: 'dashboard',
        component: DashboardComponent
    },

    {
        path: 'products',
        component: ProductsComponent
    }

];