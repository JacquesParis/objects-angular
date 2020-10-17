import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectNodeChildrenAccordionComponent } from './object-node-children-accordion.component';

describe('ObjectNodeChildrenAccordionComponent', () => {
  let component: ObjectNodeChildrenAccordionComponent;
  let fixture: ComponentFixture<ObjectNodeChildrenAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ObjectNodeChildrenAccordionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectNodeChildrenAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
