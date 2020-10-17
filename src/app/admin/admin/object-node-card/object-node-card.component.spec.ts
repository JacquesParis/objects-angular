import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectNodeCardComponent } from './object-node-card.component';

describe('ObjectNodeCardComponent', () => {
  let component: ObjectNodeCardComponent;
  let fixture: ComponentFixture<ObjectNodeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectNodeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectNodeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
