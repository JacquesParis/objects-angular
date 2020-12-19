import { IRestEntity } from '@jacquesparis/objects-model';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RestEntityListService {
  private _isOpen: { [childId: string]: boolean } = {};
  constructor() {}

  public isOpen(entityName: string, child: IRestEntity): boolean {
    const isOpen = !!this._isOpen[entityName + '_' + child.id];
    if (isOpen && child.waitForReady) {
      child.waitForReady();
      if (child?.treeNode?.waitForReady) {
        child.treeNode.waitForReady();
      }
    }
    return isOpen;
  }
  public setOpen(entityName: string, childId: string, value = true) {
    this._isOpen[entityName + '_' + childId] = value;
  }
}
