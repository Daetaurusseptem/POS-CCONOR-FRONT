import { Component, OnInit } from '@angular/core';
import { Category, User, company } from 'src/app/interfaces/models.interface';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent {

  categories!: Category[];
  company!: any;
  companyId!: string;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) { 
    this.companyId = this.authService.companyId;
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCompanyCategories(this.authService.companyId)
      .pipe(
        map(i => {
           console.log(this.categories);
          return i.categories;})



      )
      .subscribe(categories => {
        this.categories = categories!;
      });
  }
}