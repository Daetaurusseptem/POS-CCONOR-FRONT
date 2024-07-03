import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsAdminListComponent } from './ingredients-admin-list.component';

describe('IngredientsAdminListComponent', () => {
  let component: IngredientsAdminListComponent;
  let fixture: ComponentFixture<IngredientsAdminListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IngredientsAdminListComponent]
    });
    fixture = TestBed.createComponent(IngredientsAdminListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
