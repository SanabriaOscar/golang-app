import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IonicModule } from '@ionic/angular';
import { CategoryFormComponent } from './category-form.component';
import { AlertService } from '../../shared/services/alert.service';
import { Category } from '../category.model';
import * as CategoryActions from '../store/category.actions';
import { of } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import 'jasmine-core';

/**
 * Pruebas unitarias para el componente CategoryFormComponent
 *
 * Este archivo contiene las pruebas para el formulario de categorías, que permite
 * crear y editar categorías. Las pruebas verifican:
 * - La inicialización correcta del formulario
 * - La carga de datos en modo edición
 * - El envío del formulario (crear/actualizar)
 * - El manejo de errores
 * - La validación del formulario
 */

// Helper para crear el servicio de alertas mock
const createMockAlertService = () => ({
  showSuccess: jasmine.createSpy('showSuccess').and.returnValue(Promise.resolve({})),
  showError: jasmine.createSpy('showError').and.returnValue(Promise.resolve({})),
  showLoading: jasmine.createSpy('showLoading').and.returnValue(Promise.resolve({})),
  showConfirm: jasmine.createSpy('showConfirm').and.returnValue(Promise.resolve({ isConfirmed: true }))
});

// Helper para crear el estado inicial del store
const createInitialState = (categories: Category[]) => ({
  categories: {
    categories,
    loading: false,
    error: null
  }
});

// Helper para configurar el módulo de pruebas
const configureTestingModule = (alertService: any, initialState: any) => {
  return TestBed.configureTestingModule({
    imports: [
      BrowserModule,
      IonicModule.forRoot(),
      ReactiveFormsModule,
      RouterTestingModule
    ],
    providers: [
      provideMockStore({ initialState }),
      { provide: AlertService, useValue: alertService },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            paramMap: {
              get: () => null
            }
          }
        }
      }
    ]
  });
};

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;
  let store: MockStore;
  let alertService: ReturnType<typeof createMockAlertService>;

  const mockCategories: Category[] = [
    { id: 1, name: 'Categoría 1' },
    { id: 2, name: 'Categoría 2' }
  ];

  beforeEach(async () => {
    alertService = createMockAlertService();
    const initialState = createInitialState(mockCategories);

    await configureTestingModule(alertService, initialState).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Prueba básica de creación del componente
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Grupo de pruebas para el método ngOnInit
   * Verifica la inicialización del componente
   */
  describe('ngOnInit', () => {
    it('should initialize form with empty values in create mode', () => {
      component.ngOnInit();
      expect(component.form.get('name')?.value).toBe('');
    });

    it('should load category data when in edit mode', () => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');
      spyOn(store, 'select').and.returnValue(of(mockCategories));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.form.get('name')?.value).toBe('Categoría 1');
    });

    it('should dispatch loadCategories action on init', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(dispatchSpy).toHaveBeenCalledWith(CategoryActions.loadCategories());
    });
  });

  /**
   * Grupo de pruebas para el método onSubmit
   * Verifica el envío del formulario en diferentes escenarios
   */
  describe('onSubmit', () => {
    const setupForm = (name: string) => {
      component.form.patchValue({ name });
    };

    it('should dispatch addCategory action when creating new category', async () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      setupForm('Nueva Categoría');

      await component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        CategoryActions.addCategory({ category: { id: 0, name: 'Nueva Categoría' } })
      );
      expect(alertService.showSuccess).toHaveBeenCalledWith(
        'Categoría Creada',
        'La categoría ha sido creada exitosamente.'
      );
    });

    it('should dispatch updateCategory action when editing existing category', async () => {
      const route = TestBed.inject(ActivatedRoute);
      spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');
      spyOn(store, 'select').and.returnValue(of(mockCategories));

      component.ngOnInit();
      setupForm('Categoría Actualizada');

      await component.onSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(
        CategoryActions.updateCategory({
          category: { id: 1, name: 'Categoría Actualizada' }
        })
      );
      expect(alertService.showSuccess).toHaveBeenCalledWith(
        'Categoría Actualizada',
        'La categoría ha sido actualizada exitosamente.'
      );
    });

    it('should show error when form submission fails', async () => {
      spyOn(store, 'dispatch').and.throwError('Submission failed');
      setupForm('Nueva Categoría');

      await component.onSubmit();

      expect(alertService.showError).toHaveBeenCalledWith(
        'Error',
        'Ha ocurrido un error al procesar la solicitud.'
      );
    });

    it('should not submit if form is invalid', async () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      setupForm('');

      await component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(alertService.showError).toHaveBeenCalledWith(
        'Formulario Inválido',
        'Por favor, completa todos los campos requeridos.'
      );
    });
  });

  describe('Template', () => {
    const setupInvalidForm = () => {
      const nameControl = component.form.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();
      fixture.detectChanges();
    };

    it('should show validation error when name is empty and touched', () => {
      setupInvalidForm();
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('El nombre es requerido');
    });

    it('should disable submit button when form is invalid', () => {
      setupInvalidForm();
      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('ion-button[type="submit"]');
      expect(submitButton.disabled).toBeTruthy();
    });
  });
});
