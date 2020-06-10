import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitCareEditComponent } from './recruit-care-edit.component';

describe('RecruitCareEditComponent', () => {
  let component: RecruitCareEditComponent;
  let fixture: ComponentFixture<RecruitCareEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitCareEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitCareEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
