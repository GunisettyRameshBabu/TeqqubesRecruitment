import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditStateComponent } from './add-or-edit-state.component';

describe('AddOrEditStateComponent', () => {
  let component: AddOrEditStateComponent;
  let fixture: ComponentFixture<AddOrEditStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrEditStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrEditStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
