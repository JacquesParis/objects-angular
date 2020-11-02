import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RestEntityListService {
  private _isOpen: { [childId: string]: boolean } = {};
  constructor() {}

  public isOpen(entityName: string, childId: string): boolean {
    return !!this._isOpen[entityName + '_' + childId];
  }
  public setOpen(entityName: string, childId: string, value = true) {
    this._isOpen[entityName + '_' + childId] = value;
  }
}
