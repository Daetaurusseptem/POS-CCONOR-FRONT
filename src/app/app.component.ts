import { Component, HostListener, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SpinnerService } from './services/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'connor-pos-frontend';
  isFullScreen = false;

  constructor(private router: Router, private spinnerService: SpinnerService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart:
          this.spinnerService.show();
          break;
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          this.spinnerService.hide();
          break;
      }
    });

    document.addEventListener('contextmenu', (event) => event.preventDefault());

    if (localStorage.getItem('appAlreadyOpen')) {
      alert('La aplicación ya está abierta en otra pestaña.');
      window.close();
    } else {
      localStorage.setItem('appAlreadyOpen', 'true');
      window.addEventListener('beforeunload', () => {
        localStorage.removeItem('appAlreadyOpen');
      });
    }

    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('keydown', this.blockKeyCombinations);
  }

  ngOnInit() {
    // No intentamos entrar en pantalla completa automáticamente
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  onFullscreenChange() {
    this.isFullScreen = !!document.fullscreenElement;
  }

  handleFocus = () => {
    if (window.opener) {
      alert('No se permite abrir nuevas ventanas o pestañas.');
      window.close();
    }
  }

  blockKeyCombinations = (event: KeyboardEvent) => {
    if (event.ctrlKey && (event.key === 't' || event.key === 'n')) {
      event.preventDefault();
      alert('No se permite abrir nuevas pestañas o ventanas.');
    }
    if (event.ctrlKey && event.shiftKey && event.key === 'N') {
      event.preventDefault();
      alert('No se permite abrir nuevas ventanas de incógnito.');
    }
    if (event.key === 'F11') {
      event.preventDefault();
      this.requestFullScreen();
    }
  }

  requestFullScreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(this.handleFullscreenError);
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen().catch(this.handleFullscreenError);
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen().catch(this.handleFullscreenError);
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen().catch(this.handleFullscreenError);
    }
  }

  private handleFullscreenError = (err: any) => {
    console.error(`Error al intentar habilitar el modo de pantalla completa: ${err.message} (${err.name})`);
    alert('No se pudo activar el modo de pantalla completa automáticamente. Por favor, presione F11 o use la opción de pantalla completa de su navegador.');
  }
}