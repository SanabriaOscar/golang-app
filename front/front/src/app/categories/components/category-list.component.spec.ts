import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IonicModule } from '@ionic/angular';
import { CategoryListComponent } from './category-list.component';
import { AlertService } from '../../shared/services/alert.service';
import { Category } from '../category.model';
import * as CategoryActions from '../store/category.actions';
import { of } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import 'jasmine-core';

/**
 * Pruebas unitarias para el componente CategoryListComponent
 *
 * Este archivo contiene las pruebas para el listado de categorías, que permite:
 * - Visualizar todas las categorías
 * - Navegar a la edición de una categoría
 * - Eliminar categorías
 * - Manejar estados de carga y errores
 */

// Helper para crear el servicio de alertas mock
const createMockAlertService = () => ({
  showSuccess: jasmine.createSpy('showSuccess').and.returnValue(Promise.resolve({})),
  showError: jasmine.createSpy('showError').and.returnValue(Promise.resolve({})),
  showLoading: jasmine.createSpy('showLoading').and.returnValue(Promise.resolve({})),
  showConfirm: jasmine.createSpy('showConfirm').and.returnValue(Promise.resolve({ isConfirmed: true }))
});

// Helper para crear el estado inicial del store
const createInitialState = (categories: Category[], loading = false) => ({
  categories: {
    categories,
    loading,
    error: null
  }
});

// Helper para configurar el módulo de pruebas
const configureTestingModule = (alertService: any, initialState: any) => {
  return TestBed.configureTestingModule({
    imports: [
      BrowserModule,
      IonicModule.forRoot(),
      RouterTestingModule
    ],
    providers: [
      provideMockStore({ initialState }),
      { provide: AlertService, useValue: alertService }
    ]
  });
};

describe('CategoryListComponent', () => {
  let component: CategoryListComponent;
  let fixture: ComponentFixture<CategoryListComponent>;
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
    fixture = TestBed.createComponent(CategoryListComponent);
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
   * Verifica la inicialización del componente y la carga de datos
   */
  describe('ngOnInit', () => {
    it('should dispatch loadCategories action on init', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.ngOnInit();
      expect(dispatchSpy).toHaveBeenCalledWith(CategoryActions.loadCategories());
    });

    it('should select categories from store', () => {
      component.ngOnInit();
      component.categories$.subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });
    });
  });

  /**
   * Grupo de pruebas para el método onEdit
   * Verifica la navegación a la edición de una categoría
   */
  describe('onEdit', () => {
    it('should navigate to edit route', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      component.onEdit(1);
      expect(routerSpy).toHaveBeenCalledWith(['/categories/edit', 1]);
    });
  });

  /**
   * Grupo de pruebas para el método onDelete
   * Verifica el proceso de eliminación de categorías
   */
  describe('onDelete', () => {
    const setupDeleteTest = async (isConfirmed: boolean) => {
      alertService.showConfirm.and.returnValue(Promise.resolve({ isConfirmed }));
      const dispatchSpy = spyOn(store, 'dispatch');
      await component.onDelete(1);
      return dispatchSpy;
    };

    it('should show confirmation dialog and dispatch delete action when confirmed', async () => {
      const dispatchSpy = await setupDeleteTest(true);

      expect(alertService.showConfirm).toHaveBeenCalledWith(
        '¿Estás seguro?',
        'Esta acción no se puede deshacer'
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        CategoryActions.deleteCategory({ id: 1 })
      );
      expect(alertService.showSuccess).toHaveBeenCalledWith(
        'Categoría Eliminada',
        'La categoría ha sido eliminada exitosamente.'
      );
    });

    it('should not dispatch delete action when not confirmed', async () => {
      const dispatchSpy = await setupDeleteTest(false);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should show error when delete fails', async () => {
      spyOn(store, 'dispatch').and.throwError('Delete failed');
      await component.onDelete(1);

      expect(alertService.showError).toHaveBeenCalledWith(
        'Error',
        'Ha ocurrido un error al eliminar la categoría'
      );
    });
  });

  /**
   * Grupo de pruebas para el template
   * Verifica la renderización correcta de la interfaz
   */
  describe('Template', () => {
    const updateStoreState = (categories: Category[], loading: boolean) => {
      store.setState(createInitialState(categories, loading));
      fixture.detectChanges();
    };

    it('should display categories in the list', () => {
      const compiled = fixture.nativeElement;
      const categoryElements = compiled.querySelectorAll('ion-row');
      expect(categoryElements.length).toBe(mockCategories.length + 1);
    });

    it('should show spinner when loading', () => {
      updateStoreState([], true);
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('ion-spinner')).toBeTruthy();
    });

    it('should show message when no categories', () => {
      updateStoreState([], false);
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('No hay categorías');
    });
  });
});
