import { Component, OnInit } from '@angular/core';
import { Category, User, company } from 'src/app/interfaces/models.interface';
import { CategoryService } from 'src/app/services/category.service';
import { AuthService } from 'src/app/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent {

  categories!: Category[];
  company!: any;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.company = this.authService.company;
    this.getCategories(this.company._id);
  }

  getCategories(idEmpresa: string) {
    this.categoryService.getCompanyCategories(idEmpresa)
      .pipe(
        map(i => i.categories)
      )
      .subscribe(categories => {
        this.categories = categories!;
      });
  }
}