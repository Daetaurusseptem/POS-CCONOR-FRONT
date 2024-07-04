import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'; // Asegúrate de importar tu servicio de autenticación
import { Product } from 'src/app/interfaces/models.interface';

@Component({
  selector: 'items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {
  @Input() items: Product[] = [];
  userRole!: 'admin' | 'sysadmin' | 'user';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserRole();
  }

  getUserRole(): void {
    this.userRole = this.authService.role;
  }
}
