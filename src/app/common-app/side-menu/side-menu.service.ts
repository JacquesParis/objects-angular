import { SideMenuComponent } from './side-menu.component';
import { Injectable } from '@angular/core';

export class SideMenuService {
  public component: SideMenuComponent;
  constructor() {}

  initService(component: SideMenuComponent) {
    this.component = component;
  }
  public showMainContent() {
    this.component.showMainContent();
  }

  public showLeftSideMenu() {
    this.component.showLeftSideMenu();
  }
}
