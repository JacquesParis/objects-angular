import { IDataEntity } from '@jacquesparis/objects-client';
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

  public trackByFunc(item: IDataEntity) {
    return item.id;
  }

  get labelClass() {
    return 'col-12 col-sm-3 col-lg-2  col-form-label';
  }
  get inputClass() {
    return 'col-12 col-sm-9 col-lg-10';
  }
}
