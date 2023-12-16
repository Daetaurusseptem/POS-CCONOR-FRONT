import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SysAdminGuard } from 'src/app/guards/sys-admin.guard';
import { AuthGuardGuard } from 'src/app/guards/is-auth.guard';
import { AdminGuard } from 'src/app/guards/admin-guard.guard';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { ReportsComponent } from './dashboard/reports/reports.component';
import { CompanyAdminHomeComponent } from './adminTools/company-admin-home/company-admin-home.component';
import { CompanyListComponent } from './sysAdminTools/companies/company-list/company-list.component';
import { CreateCompanyComponent } from './sysAdminTools/companies/create-company/create-company.component';
import { EditCompanyComponent } from './sysAdminTools/companies/edit-company/edit-company.component';


import { PagesComponent } from './pages.component';

import { UserEditComponent } from './sysAdminTools/users/edit-user/edit-user.component';

import { DashboardPageComponent } from './dashboard/dashboard-page/dashboard-page.component';
import { CompanyUsersComponent } from './adminTools/users/company-users/company-users.component';
import { CompanyDetailsComponent } from './sysAdminTools/companies/company-details/company-details.component';
import { AddSubscriptionComponent } from './sysAdminTools/companies/add-suscription/add-suscription.component';
import { SelectSubscriptionsComponent } from './sysAdminTools/subscriptions/select-subscriptions/select-subscriptions.component';
import { CreateUserReComponent } from '../components/shared/create-user/create-user.component';
import { UserListComponent } from '../components/shared/user-list/user-list.component';
import { RoleGuard } from '../guards/role.guard';
// ... otros componentes del dashboard

const routes: Routes = [
  {
    path: '',
    component:PagesComponent,
    canActivate:[AuthGuardGuard],
    children: [
      { path: '', component: DashboardPageComponent, canActivate:[RoleGuard] },
      { path: 'overview', component: OverviewComponent },
      { path: 'reports', component: ReportsComponent },
      //SYSADMIN
      { path: 'sysadmin/users',canActivate:[SysAdminGuard], component:  UserListComponent},
      { path: 'sysadmin/users/edit/:id',canActivate:[SysAdminGuard], component:  UserEditComponent},
      { path: 'sysadmin/users/new',canActivate:[SysAdminGuard], component:  CreateUserReComponent},
      { path: 'sysadmin/companies',canActivate:[SysAdminGuard], component:  CompanyListComponent},
      { path: 'sysadmin/companies/new',canActivate:[SysAdminGuard], component:  CreateCompanyComponent},
      { path: 'sysadmin/companies/edit/:id',canActivate:[SysAdminGuard], component:  EditCompanyComponent},
      { path: 'sysadmin/companies/details/:id',canActivate:[SysAdminGuard], component:  CompanyDetailsComponent},
      { path: 'sysadmin/companies/subscriptions/select',canActivate:[SysAdminGuard], component:  SelectSubscriptionsComponent},
      { path: 'sysadmin/companies/subscription/:id',canActivate:[SysAdminGuard], component:  AddSubscriptionComponent},
      
      //ADMIN
      { path: 'admin',canActivate:[AdminGuard], component:  CompanyAdminHomeComponent},
      { path: 'admin/users',canActivate:[AdminGuard], component:  UserListComponent},
      { path: 'admin/users/new',canActivate:[AdminGuard], component:  CreateUserReComponent},
      // ... otras rutas hijas del dashboard
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class childrenPagesRouting { }
