import { Subscription } from 'rxjs';
import { IDataEntity } from '@jacquesparis/objects-model';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

export class CommonComponentComponent implements OnInit, OnDestroy {
  private subscriptions: (() => void)[] = [];
  constructor() {}
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub();
    }
  }

  ngOnInit(): void {}

  public registerSubscription(sub: Subscription | (() => void)) {
    if (sub instanceof Subscription) {
      this.subscriptions.push(sub.unsubscribe.bind(sub));
    } else {
      this.subscriptions.push(sub);
    }
  }

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
