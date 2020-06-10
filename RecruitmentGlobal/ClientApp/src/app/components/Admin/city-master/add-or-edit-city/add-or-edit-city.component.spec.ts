import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditCityComponent } from './add-or-edit-city.component';

describe('AddOrEditCityComponent', () => {
  let component: AddOrEditCityComponent;
  let fixture: ComponentFixture<AddOrEditCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
