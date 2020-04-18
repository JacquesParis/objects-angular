import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectSubTypesAccordionComponent } from './object-sub-types-accordion.component';

describe('ObjectSubTypesAccordionComponent', () => {
  let component: ObjectSubTypesAccordionComponent;
  let fixture: ComponentFixture<ObjectSubTypesAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectSubTypesAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectSubTypesAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
