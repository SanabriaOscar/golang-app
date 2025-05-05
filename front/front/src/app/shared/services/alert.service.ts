import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private readonly defaultOptions = {
    customClass: {
      popup: 'swal2-popup-custom',
      confirmButton: 'swal2-confirm-button-custom'
    },
    buttonsStyling: false,
    confirmButtonColor: '#3880ff',
    heightAuto: false
  };

  showSuccess(title: string, message: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text: message,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  }

  showError(title: string, message: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  showLoading(title: string = 'Procesando...'): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  showConfirm(title: string, message: string): Promise<SweetAlertResult> {
    return Swal.fire({
      ...this.defaultOptions,
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33'
    });
  }
}
