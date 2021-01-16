import { IRestEntity } from '@jacquesparis/objects-model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestEntityListService {
  private _isOpen: { [childId: string]: boolean } = {};
  private _Subscriptions: { [entityName: string]: Subject<void> } = {};
  constructor() {}

  subscribe(entityName: string, handler: () => void) {
    if (!(entityName in this._Subscriptions)) {
      this._Subscriptions[entityName] = new Subject<void>();
    }
    return this._Subscriptions[entityName].asObservable().subscribe(handler);
  }

  public isOpen(entityName: string, child: IRestEntity): boolean {
    const isOpen = !!this._isOpen[entityName + '_' + child.id];
    if (isOpen && child.waitForReady && !child.isReady) {
      child.waitForReady().then(() => {
        if (entityName in this._Subscriptions) {
          this._Subscriptions[entityName].next();
        }
      });
      if (child?.treeNode?.waitForReady) {
        child.treeNode.waitForReady();
      }
    }
    return isOpen;
  }

  public switchOpen(entityName: string, childId: string) {
    this.setOpen(
      entityName,
      childId,
      !this._isOpen[entityName + '_' + childId]
    );
  }

  public setOpen(entityName: string, childId: string, value = true) {
    let previsousValue = this._isOpen[entityName + '_' + childId];
    this._isOpen[entityName + '_' + childId] = value;
    if (previsousValue !== value && entityName in this._Subscriptions) {
      this._Subscriptions[entityName].next();
    }
  }
}
