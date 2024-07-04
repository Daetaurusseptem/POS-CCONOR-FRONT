import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SupplierService } from 'src/app/services/provider.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css']
})
export class CreateSupplierComponent {


  companyId = ''

  supplierForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private supplierService: SupplierService,
    private router: Router,
  ) {

   }

  ngOnInit(): void {
    this.companyId = this.authService.companyId!
    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
    });

  }

  onSubmit() {
    if (this.supplierForm.valid) {
      
      const obj = {
        name:this.supplierForm.get('name')?.value,
        description:this.supplierForm.get('description')?.value,
        contactInfo:{
          email:this.supplierForm.get('email')?.value,
          phone:this.supplierForm.get('phone')?.value,
          address:this.supplierForm.get('address')?.value,
        }
      }

      Swal.fire({
        'text': 'Estas seguro?'
      })
      .then(r=>{
        if(r.isConfirmed){
          this.supplierService.createSupplier(obj,this.authService.companyId!)
  
          .subscribe(resp=>{
            console.log(resp);
            
              Swal.fire({
                text:'Proveedor guardado',
                icon:'success'
              })
              .then(res=>{
                if (res.isConfirmed) {
                  this.router.navigateByUrl('/dashboard/admin')
                }
              })

          })
        }
      })
    }
  }
}
