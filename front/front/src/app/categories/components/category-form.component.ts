import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { IonicModule } from '@ionic/angular';

import { addCategory, updateCategory, loadCategories } from '../store/category.actions';
import { Category } from '../category.model';
import { selectAllCategories } from '../store/category.selectors';
import { CommonModule } from '@angular/common';
import { filter, take } from 'rxjs';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, RouterModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/categories"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEdit ? 'Editar Categoría' : 'Crear Categoría' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="category-form">
        <ion-item>
          <ion-label position="floating">Nombre</ion-label>
          <ion-input formControlName="name" type="text"></ion-input>
        </ion-item>

        <ion-text color="danger" *ngIf="form.get('name')?.invalid && form.get('name')?.touched" class="error-message">
          El nombre es requerido.
        </ion-text>

        <div class="form-actions">
          <ion-button expand="block" type="submit" [disabled]="form.invalid" color="primary">
            {{ isEdit ? 'Actualizar' : 'Guardar' }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  `,
  styles: [`
    .category-form {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .error-message {
      display: block;
      margin: 5px 0 15px 16px;
      font-size: 12px;
    }
    .form-actions {
      margin-top: 20px;
    }
    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      margin-bottom: 10px;
    }
  `]
})
export class CategoryFormComponent implements OnInit {
  form = inject(FormBuilder).group({
    id: [null as number | null],
    name: ['', Validators.required],
  });

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly alertService = inject(AlertService);

  isEdit = false;

  ngOnInit() {
    this.store.dispatch(loadCategories());

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      const id = parseInt(idParam, 10);

      this.store.select(selectAllCategories)
        .pipe(
          filter(categories => categories.length > 0),
          take(1)
        )
        .subscribe({
          next: (categories) => {
            const category = categories.find(c => c.id === id);
            if (category) {
              console.log('Cargando categoría:', category);
              this.form.patchValue({
                id: category.id,
                name: category.name
              });
            } else {
              console.error('Categoría no encontrada:', id);
              this.alertService.showError('Categoría no encontrada', 'La categoría que intentas editar no existe.');
              this.router.navigate(['/categories']);
            }
          },
          error: (error) => {
            console.error('Error al cargar la categoría:', error);
            this.alertService.showError('Error al cargar', 'No se pudo cargar la información de la categoría.');
            this.router.navigate(['/categories']);
          }
        });
    }
  }

  async onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const category: Category = {
        id: formValue.id ?? 0,
        name: formValue.name ?? ''
      };

      try {
        if (this.isEdit) {
          if (!category.id) {
            throw new Error('ID de categoría no válido');
          }

          this.store.dispatch(updateCategory({ category }));
          await this.alertService.showSuccess(
            'Categoría Actualizada',
            'La categoría ha sido actualizada exitosamente.'
          );
        } else {
          this.store.dispatch(addCategory({ category }));
          await this.alertService.showSuccess(
            'Categoría Creada',
            'La categoría ha sido creada exitosamente.'
          );
        }

        setTimeout(() => {
          this.router.navigate(['/categories']);
        }, 1000);
      } catch (error) {
        console.error('Error al procesar la categoría:', error);
        this.alertService.showError(
          'Error',
          'Ha ocurrido un error al procesar la solicitud.'
        );
      }
    } else {
      this.alertService.showError(
        'Formulario Inválido',
        'Por favor, completa todos los campos requeridos.'
      );
    }
  }
}
