import { IDataEntity } from '@jacquesparis/objects-model';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

export class CommonComponentComponent implements OnInit, OnDestroy {
  constructor() {}
  ngOnDestroy(): void {}

  ngOnInit(): void {}

  public trackByFunc(item: { id?: string; updatedId?: string }) {
    return item.id + '_' + item.updatedId;
  }

  get labelClass() {
    return 'col-12 col-sm-3 col-lg-2  col-form-label';
  }
  get inputClass() {
    return 'col-12 col-sm-9 col-lg-10';
  }
}
