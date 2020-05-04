import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectNodesListComponent } from './object-nodes-list.component';

describe('ObjectNodesListComponent', () => {
  let component: ObjectNodesListComponent;
  let fixture: ComponentFixture<ObjectNodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectNodesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectNodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
