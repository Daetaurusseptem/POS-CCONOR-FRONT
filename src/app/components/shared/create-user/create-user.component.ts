import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { User, company } from 'src/app/interfaces/models.interface';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserReComponent {

  userRole!:'admin'|'sysadmin'|'user';
  companies!:company[];
  companyId!:string;
  

  user: User = {
    name: '',
    email:'',
    username: '',
    password: '',
    role: 'user',
    companyId:''
  };
  
  constructor(
              private userService: UsersService,
              private companiesService: CompanyService,
              private authService: AuthService,
              private router: Router,

              
              ) {
                this.getRole();
                console.log(this.authService.getCompany)
              }

getRole(){
  this.userRole = this.authService.role;
  if(this.userRole=='user'){
    return 'user'
  }else if(this.userRole=='admin'){
    console.log('admin');
    this.companies = [];
    this.companyId=this.authService.getCompany._id!
    this.user.companyId=this.companyId
    console.log(this.companyId,this.user);
    this.user.role =='user'
    
  }else if(this.userRole=='sysadmin'){
    console.log('sys');
    this.getCompanies()
    this.companyId=''
    this.user.role =='admin'
    
  }
  return
}              
  getCompanies(){
    this.companiesService.getCompanies()
    .pipe(
      map(item=>item.companies)
    )
    .subscribe(companies=>{this.companies=companies!})

  }

  createUser(form: NgForm) {
    if(this.userRole=='user'){
      return 
    }
    
    if (form.valid) {
      console.log(form.value);
      this.userService.createUser(this.user).subscribe({
        next: (createdCompany) => {
          Swal.fire({
            text:'Usuario creado correctamente',
            icon:'success'
          })
          .then(()=>{
            if(this.userRole=='admin'){
              this.router.navigateByUrl('/dashboard/admin/users')
            }else if(this.userRole=='sysadmin'){
              this.router.navigateByUrl('/dashboard/sysadmin/users')
            }
          })
        },
        error: (error) => {
          Swal.fire({
            text:'Usuario no pudo ser creado',
            icon:'error'
          })
          
        }
      });
    }
  }
}
