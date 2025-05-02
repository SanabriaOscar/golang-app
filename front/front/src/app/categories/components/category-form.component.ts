import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { IonicModule } from '@ionic/angular';

import { addCategory, updateCategory } from '../store/category.actions';
import { Category } from '../category.model';
import { selectAllCategories } from '../store/category.selectors';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, RouterModule, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ isEdit ? 'Editar Categoría' : 'Crear Categoría' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <ion-item>
          <ion-label position="floating">Nombre</ion-label>
          <ion-input formControlName="name"></ion-input>
        </ion-item>

        <ion-text color="danger" *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
          El nombre es requerido.
        </ion-text>

        <ion-button expand="block" type="submit" [disabled]="form.invalid">
          {{ isEdit ? 'Actualizar' : 'Guardar' }}
        </ion-button>
      </form>
    </ion-content>
  `
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

      this.store.select(selectAllCategories).pipe(take(1)).subscribe(categories => {
        const category = categories.find(c => c.id === id);
        if (category) {
          this.form.patchValue(category);
        }
      });
    }
  }

  onSubmit() {
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
