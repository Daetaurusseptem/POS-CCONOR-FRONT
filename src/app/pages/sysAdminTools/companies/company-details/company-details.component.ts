import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User, company } from 'src/app/interfaces/models.interface';
import { CompanyService } from 'src/app/services/company.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  company!: company;
  admin!: User
  id: string = '';

ngOnInit(): void {
  this.activatedRoute.params.subscribe(params => {  
    this.id = params['id'];
        this.getCompany(this.id);
  })
}



  constructor(
    private companyService: CompanyService,
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
   
  }
  
  getCompany(id: string) {
    return this.companyService.getCompany(id)
    .pipe(
      map(item => {
        return item.company
      })
      )
      .subscribe(company => {
        
        this.company = company!;
        this.getAdmin(company!.adminId!)

      })

  }
  getAdmin(adminId:string){
    this.userService.getUserById(adminId)
    .pipe(
      map(item=>{
        
        return item.user
      })
      )
      .subscribe(adminCompany=>{
        this.admin=adminCompany!;
        console.log(this.admin);
    })

  }


}
