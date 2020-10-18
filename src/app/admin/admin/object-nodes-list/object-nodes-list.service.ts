import { Injectable } from '@angular/core';

@Injectable()
export class ObjectNodesListService {
  private _isOpen: { [childId: string]: boolean } = {};
  constructor() {}

  public isOpen(childId: string): boolean {
    return !!this._isOpen[childId];
  }
  public setOpen(childId: string, value = true) {
    this._isOpen[childId] = value;
  }
}
