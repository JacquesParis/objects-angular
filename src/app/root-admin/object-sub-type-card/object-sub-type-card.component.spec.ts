import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectSubTypeCardComponent } from './object-sub-type-card.component';

describe('ObjectSubTypeCardComponent', () => {
  let component: ObjectSubTypeCardComponent;
  let fixture: ComponentFixture<ObjectSubTypeCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectSubTypeCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectSubTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
