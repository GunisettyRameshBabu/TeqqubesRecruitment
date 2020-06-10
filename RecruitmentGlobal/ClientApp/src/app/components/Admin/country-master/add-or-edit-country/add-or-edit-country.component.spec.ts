import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditCountryComponent } from './add-or-edit-country.component';

describe('AddOrEditCountryComponent', () => {
  let component: AddOrEditCountryComponent;
  let fixture: ComponentFixture<AddOrEditCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
