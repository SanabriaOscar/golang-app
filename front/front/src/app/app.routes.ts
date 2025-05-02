import { Routes } from '@angular/router';
import { CategoryListComponent } from './categories/components/category-list.component';
import { CategoryFormComponent } from './categories/components/category-form.component';

export const routes: Routes = [
  {
    path: 'categories',
    component: CategoryListComponent
  },
  {
    path: 'categories/new',
    component: CategoryFormComponent
  },
  {
    path: 'categories/edit/:id',
    component: CategoryFormComponent
  },
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full'
  }
];
