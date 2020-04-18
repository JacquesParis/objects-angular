import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectTypeCardComponent } from './object-type-card.component';

describe('ObjectTypeCardComponent', () => {
  let component: ObjectTypeCardComponent;
  let fixture: ComponentFixture<ObjectTypeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectTypeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
