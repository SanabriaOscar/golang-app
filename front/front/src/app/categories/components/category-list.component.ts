import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { loadCategories, deleteCategory } from '../store/category.actions';
import { selectAllCategories } from '../store/category.selectors';
import { Category } from '../category.model';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  host: {
    'ngSkipHydration': 'true'
  },
  imports: [IonicModule, CommonModule, RouterModule],
  template: `
  <ion-header>
    <ion-toolbar color="primary">
      <ion-title>Categorías</ion-title>
    </ion-toolbar>
  </ion-header>

  <ion-content class="ion-padding">
    <ion-button expand="block" color="success" routerLink="/categories/new">
      Crear Categoría
    </ion-button>

    <ion-grid *ngIf="categories$ | async as categories">
      <ion-row class="table-header" color="light">
        <ion-col><strong>ID</strong></ion-col>
        <ion-col><strong>Nombre</strong></ion-col>
        <ion-col size="auto"><strong>Acciones</strong></ion-col>
      </ion-row>

      <ion-row *ngIf="categories.length === 0">
        <ion-col colspan="3">No hay categorías</ion-col>
      </ion-row>

      <ion-row *ngFor="let category of categories">
        <ion-col>{{ category.id }}</ion-col>
        <ion-col>{{ category.name }}</ion-col>
        <ion-col size="auto">
          <ion-button fill="clear" color="warning" (click)="onEdit(category.id)">
            Editar
          </ion-button>
          <ion-button fill="clear" color="danger" (click)="onDelete(category.id)">
            Eliminar
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-grid>

    <ion-spinner *ngIf="!(categories$ | async)"></ion-spinner>
  </ion-content>
`
})
export class CategoryListComponent implements OnInit {
  categories$!: Observable<Category[]>;
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  ngOnInit() {
    this.categories$ = this.store.select(selectAllCategories);
    this.store.dispatch(loadCategories());

    this.categories$.subscribe(categories => {
      console.log('Categorias desde Store:', categories);
    });
  }

  onEdit(id: number) {
    this.router.navigate(['/categories/edit', id]);
  }

  async onDelete(id: number) {
    try {
      const result = await this.alertService.showConfirm(
        '¿Estás seguro?',
        'Esta acción no se puede deshacer'
      );

      if (result.isConfirmed) {
        await this.alertService.showLoading('Eliminando...');
        this.store.dispatch(deleteCategory({ id }));
        await this.alertService.showSuccess(
          '¡Eliminado!',
          'La categoría ha sido eliminada exitosamente'
        );
      }
    } catch (error) {
      this.alertService.showError(
        'Error',
        'Ha ocurrido un error al eliminar la categoría'
      );
    }
  }
}
