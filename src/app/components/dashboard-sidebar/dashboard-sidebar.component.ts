import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/models.interface';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { MenuService } from 'src/app/services/menu.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent {
  menu:any;
  menuItems: any[]=[];
  usuario!:UsuarioModel;

constructor(
  private menuService:MenuService,
  private authServices:AuthService,
  private router:Router
  ) {
    this.usuario = this.authServices.usuario
  }

  ngOnInit(): void {
    this.menuItems = this.menuService.menu
    
}

logOut(){
  this.authServices.borrarLocalStorage();
  this.router.navigateByUrl('login')
}
}
