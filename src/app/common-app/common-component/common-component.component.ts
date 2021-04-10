import { Subscription } from 'rxjs';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

export class CommonComponent implements OnInit, OnDestroy {
  private subscriptions: ((() => void) | Function)[] = [];
  public _id = Math.ceil(Math.random() * 1000000000000000);
  constructor() {}
  ngOnDestroy(): void {
    this.cancelSubscription();
  }

  protected cancelSubscription() {
    for (const sub of this.subscriptions) {
      sub();
    }
    this.subscriptions = [];
  }

  ngOnInit(): void {}

  public registerSubscription(sub: Subscription | (() => void) | Function) {
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
