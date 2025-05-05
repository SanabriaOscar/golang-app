import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { IonicModule } from '@ionic/angular';

import { addCategory, updateCategory } from '../store/category.actions';
import { Category } from '../category.model';
import { selectAllCategories } from '../store/category.selectors';
import { CommonModule } from '@angular/common';
import { filter, take } from 'rxjs';

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

  isEdit = false;

  ngOnInit() {
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
              this.form.patchValue(category);
            } else {
              console.error('Category not found');
              this.router.navigate(['/categories']);
            }
          },
          error: (error) => {
            console.error('Error loading category:', error);
            this.router.navigate(['/categories']);
          }
        });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const category: Category = {
        id: this.form.value.id ?? 0,
        name: this.form.value.name ?? ''
      };

      if (this.isEdit) {
        this.store.dispatch(updateCategory({ category }));
      } else {
        this.store.dispatch(addCategory({ category }));
      }
      this.router.navigate(['/categories']);
    }
  }
}
