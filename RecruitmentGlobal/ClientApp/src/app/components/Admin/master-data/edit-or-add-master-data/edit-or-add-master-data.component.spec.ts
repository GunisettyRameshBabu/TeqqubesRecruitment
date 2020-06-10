import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrAddMasterDataComponent } from './edit-or-add-master-data.component';

describe('EditOrAddMasterDataComponent', () => {
  let component: EditOrAddMasterDataComponent;
  let fixture: ComponentFixture<EditOrAddMasterDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrAddMasterDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrAddMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
