import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitCareComponent } from './recruit-care.component';

describe('RecruitCareComponent', () => {
  let component: RecruitCareComponent;
  let fixture: ComponentFixture<RecruitCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
