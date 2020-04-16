import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInterestComponent } from './edit-interest.component';

describe('EditInterestComponent', () => {
  let component: EditInterestComponent;
  let fixture: ComponentFixture<EditInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
