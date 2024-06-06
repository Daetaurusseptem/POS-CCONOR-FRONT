import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService:AuthService,
    private router:Router
    ){}
canActivate(
route: ActivatedRouteSnapshot,
state: RouterStateSnapshot):  boolean  {
  console.log(this.authService.role);
if(this.authService.role=='admin'){
return true;
}else if(this.authService.role=='user'){
  
  return false
}else if(this.authService.role=='sysadmin'){
  this.router.navigateByUrl('/dashboard/sysadmin')
  return false
}else {
  this.router.navigateByUrl('/')
  return false
}



}
}