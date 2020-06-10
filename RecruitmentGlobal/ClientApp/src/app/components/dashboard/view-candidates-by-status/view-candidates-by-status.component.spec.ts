import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidatesByStatusComponent } from './view-candidates-by-status.component';

describe('ViewCandidatesByStatusComponent', () => {
  let component: ViewCandidatesByStatusComponent;
  let fixture: ComponentFixture<ViewCandidatesByStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCandidatesByStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCandidatesByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
