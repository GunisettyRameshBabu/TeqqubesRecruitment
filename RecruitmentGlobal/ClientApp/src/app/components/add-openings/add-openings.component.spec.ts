import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpeningsComponent } from './add-openings.component';

describe('AddOpeningsComponent', () => {
  let component: AddOpeningsComponent;
  let fixture: ComponentFixture<AddOpeningsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOpeningsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpeningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
