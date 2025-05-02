import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) {
    console.log('CategoryService instantiated');
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl).pipe(
      tap((categories) => {
        if (categories && categories.length > 0) {
          console.log('Data received from backend:', categories);
        } else {
          console.log('No records found.');
        }
      })
    );
  }
    /* getCategories(): Observable<Category[]> {
      console.log('Service is being called'); // Añade esto
      return of([{id: 1, name: 'Test'}]); // Usa un observable simple para pruebas
    }*/

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, category);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${category.id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
