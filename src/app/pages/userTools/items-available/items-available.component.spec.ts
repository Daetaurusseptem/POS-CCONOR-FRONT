import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsAvailableComponent } from './items-available.component';

describe('ItemsAvailableComponent', () => {
  let component: ItemsAvailableComponent;
  let fixture: ComponentFixture<ItemsAvailableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsAvailableComponent]
    });
    fixture = TestBed.createComponent(ItemsAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
