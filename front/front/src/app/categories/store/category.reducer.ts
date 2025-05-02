
import { createReducer, on } from '@ngrx/store';
import { initialCategoryState } from './category.state';
import * as CategoryActions from './category.actions';
export const categoryReducer = createReducer(
  initialCategoryState,
  on(CategoryActions.loadCategories, (state) => ({ ...state, loading: true })),
  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => {
    console.log('Categorías cargadas en el reducer:', categories);  // Verifica si el estado se actualiza correctamente
    return {
      ...state,
      loading: false,
      categories: categories,
    };
  }),
  on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CategoryActions.addCategory, (state) => ({ ...state, loading: true })),
  on(CategoryActions.addCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    categories: [...state.categories, category],
  })),
  on(CategoryActions.addCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CategoryActions.updateCategory, (state) => ({ ...state, loading: true })),
  on(CategoryActions.updateCategorySuccess, (state, { category }) => ({
    ...state,
    loading: false,
    categories: state.categories.map((cat) => (cat.id === category.id ? category : cat)),
  })),
  on(CategoryActions.updateCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CategoryActions.deleteCategory, (state) => ({ ...state, loading: true })),
  on(CategoryActions.deleteCategorySuccess, (state, { id }) => ({
    ...state,
    loading: false,
    categories: state.categories.filter((cat) => cat.id !== id),
  })),
  on(CategoryActions.deleteCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
  );


