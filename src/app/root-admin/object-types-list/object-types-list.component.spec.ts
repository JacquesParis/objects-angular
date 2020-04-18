import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectTypesListComponent } from './object-types-list.component';

describe('ObjectTypesListComponent', () => {
  let component: ObjectTypesListComponent;
  let fixture: ComponentFixture<ObjectTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectTypesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
