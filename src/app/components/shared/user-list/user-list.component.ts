import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { User, company } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  @Input() padre: Boolean = false;
  adminId!: string;
  companyId!: string;
  users!: User[];
  company!: company;
  userRole!: 'admin' | 'sysadmin' | 'user';

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    private modalService: ModalService,
    private utilitiesService: UtilitiesService
  ) { 
    this.adminId = this.authService.idUsuario;
    this.getRole();
    if(this.userRole == 'admin'){
      console.log('company');
      this.getCompanyUsers();
    } else if(this.userRole == 'sysadmin'){
      console.log('sys');
      this.getAllAdminUsers();
    }
  }

  ngOnInit() {}

  getRole() {
    this.userRole = this.authService.role;
  }

  getCompanyUsers() {
    console.log(this.authService.getCompany);
    this.company = this.authService.getCompany;
    this.companyId = this.authService.companyId;
    console.log(this.companyId);
    this.userService.getAllNonAdminUsersOfCompany(this.adminId)
      .pipe(
        map(item => {
          console.log(item);
          return item.users;
        })
      )
      .subscribe(users => {
        this.users = users!;
      });
  }

  getAllAdminUsers() {
    console.log(this.authService.getCompany);
    this.userService.getAllAdmins()
      .pipe(
        map(item => {
          return item.users;
        })
      )
      .subscribe(users => {
        this.users = users!;
      });
  }

  eliminarUsuario(id:string){
    Swal.fire({
      title:'Esta Seguro?',
      text:'Este proceso no se podrá deshacer',
      icon:'warning',
      showCancelButton:true,
      cancelButtonColor:'#F56A52',
      iconColor:'#F56A52',
      allowEnterKey:false

    })
    .then(resp=>{
      if(resp.isConfirmed){
        this.userService.deleteuser(id)
        .subscribe(resp=>{
          if(resp.ok==true){
            Swal.fire({
              title:'Registro eliminado',
              icon:'success'
            })
          }else if(resp.ok==false){
            Swal.fire({
              title:'El registro no pudo ser eliminado',
              icon:'error'
            })

          }

          this.utilitiesService.redirectTo(`/dashboard/sysadmin/users`)
        }, err=>{
          Swal.fire({
            title:'Registro no eliminado',
            icon:'error',
            text:err.error.msg
          })
        })
      }
    })
  }

  abrirModal(element: company | User, tipo: "empresas" | "usuarios" | "productos") {
    console.log(element);
    const { _id } = element;
    this.modalService.abrirModal(element.img, tipo, _id!);
  }
}
