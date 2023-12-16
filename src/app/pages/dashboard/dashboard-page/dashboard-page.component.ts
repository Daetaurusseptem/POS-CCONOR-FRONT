import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CompanyService } from 'src/app/services/company.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit{
  numberOfUsers:any;
  numberOfCompanies:any;
  constructor(
    private  companyService:CompanyService,
    private  userServices:UsersService,

    ){

  }
ngOnInit(): void {
  this.getNumberUsers();
  this.getNumberCompanies();
}
getNumberUsers(){
  this.userServices.getNumberUsers()
  .pipe(
    map(item=>item.numberOfUsers)

  )
  .subscribe(numberOfUsers=>{
    console.log(numberOfUsers);
    this.numberOfUsers= numberOfUsers
  })
}
getNumberCompanies(){
  this.companyService.getNumberOfCompanies()
  .pipe(
    map(item=>item.numberOfCompanies)

  )
  .subscribe(numberOfCompanies=>{
    console.log(numberOfCompanies);
    this.numberOfCompanies= numberOfCompanies
  })
}
verReportes() {
throw new Error('Method not implemented.');
}
gestionarUsuarios() {
throw new Error('Method not implemented.');
}

}
