import { Actions, ofType, createEffect } from '@ngrx/effects';
import { CategoryService } from '../category.service';
import * as CategoryActions from './category.actions';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';

import { inject, Injectable } from '@angular/core';
import { Category } from '../category.model';
import { loadCategories, loadCategoriesFailure, loadCategoriesSuccess } from './category.actions';
@Injectable()
export class CategoryEffects {
  private actions$ = inject(Actions);
  private categoryService = inject(CategoryService);

  loadCategories$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadCategories),
      exhaustMap(() => this.categoryService.getCategories().pipe(
        map(categories => loadCategoriesSuccess({ categories })),
        catchError(error => of(loadCategoriesFailure({ error })))
      )

      )
    );
  });




  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.addCategory),
      switchMap(action =>
        this.categoryService.addCategory(action.category).pipe(
          map(category => CategoryActions.addCategorySuccess({ category })),
          catchError(error => of(CategoryActions.addCategoryFailure({ error: error.message })))
        )
      )
    )
  );
  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.updateCategory),
      switchMap(action =>
        this.categoryService.updateCategory(action.category).pipe(
          map(category => CategoryActions.updateCategorySuccess({ category })),
          catchError(error => of(CategoryActions.updateCategoryFailure({ error: error.message })))
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      switchMap(action =>
        this.categoryService.deleteCategory(action.id).pipe(
          map(() => CategoryActions.deleteCategorySuccess({ id: action.id })),
          catchError(error => of(CategoryActions.deleteCategoryFailure({ error: error.message })))
        )
      )
    )
  );
}



