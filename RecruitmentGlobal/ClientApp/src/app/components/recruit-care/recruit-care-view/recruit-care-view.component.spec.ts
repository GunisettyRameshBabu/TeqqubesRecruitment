import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitCareViewComponent } from './recruit-care-view.component';

describe('RecruitCareViewComponent', () => {
  let component: RecruitCareViewComponent;
  let fixture: ComponentFixture<RecruitCareViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitCareViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitCareViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
