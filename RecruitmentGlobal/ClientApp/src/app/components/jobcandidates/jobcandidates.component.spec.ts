import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcandidatesComponent } from './jobcandidates.component';

describe('JobcandidatesComponent', () => {
  let component: JobcandidatesComponent;
  let fixture: ComponentFixture<JobcandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobcandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobcandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
