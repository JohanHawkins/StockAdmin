import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { ToastComponent } from '../toast/toast';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private injector: Injector,
    private ngZone: NgZone,
  ) {}

  handleError(error: any): void {
    console.error('Error global capturado:', error);

    this.ngZone.run(() => {
      const toast = this.injector.get(ToastComponent);
      toast.message = 'Ha ocurrido un error inesperado';
      toast.type = 'error';
      toast.visible = true;

      setTimeout(() => {
        toast.visible = false;
      }, 3000);
    });
  }
}
