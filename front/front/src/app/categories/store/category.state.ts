



import { Category } from "../category.model";

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: any;
}

export const initialCategoryState: CategoryState = {
  categories: [],
  loading: false,
  error: null
};
