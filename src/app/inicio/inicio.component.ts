import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  titulo = 'CConor POS';

  iniciarSesion() {
    alert('Función de inicio de sesión no implementada aún.');
  }
}
