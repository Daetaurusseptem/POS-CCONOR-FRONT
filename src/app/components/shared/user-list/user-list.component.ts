import { Component } from '@angular/core';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, company } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  adminId!: string
  companyId!: string
  users!: User[];
  company!: company;
  userRole!:'admin'|'sysadmin'|'user';
  
  
  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private modalService: ModalService
    ) { 
    this.adminId = this.authService.idUsuario
    this.getRole();
    if(this.userRole == 'admin'){
      console.log('company');
      this.getCompanyUsers();
    }else if(this.userRole =='sysadmin'){
      console.log('sys');
      this.getAllAdminUsers()
    }
  }


  getRole() {
    this.userRole = this.authService.role;
    
  }
  getCompanyUsers(){
    console.log( this.authService.getCompany);
    this.company = this.authService.getCompany
    this.companyId = this.company._id!;
    console.log(this.companyId);
    this.userService.getAllNonAdminUsersOfCompany(this.adminId)
      .pipe(
        map(item => {
          console.log(item);
          return item.users
        })
      )
      .subscribe(users => {
        this.users = users!;
      })
  }
  getAllAdminUsers(){
    console.log(this.authService.getCompany);
    
    this.userService.getAllAdmins()
      .pipe(
        map(item => {
          return item.users
        })
      )
      .subscribe(users => {
        this.users = users!;
      })
  }

  ngOnInit(): void {
    
  }
 
  abrirModal( element: company|User,tipo:"empresas" | "usuarios" | "productos" ) {
    console.log(element);
    const {_id} = element
    this.modalService.abrirModal(element.img,tipo,_id!);
  }
}
