import { SideMenuService } from './../../../common-app/side-menu/side-menu.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-welcome',
  templateUrl: './admin-welcome.component.html',
  styleUrls: ['./admin-welcome.component.scss'],
})
export class AdminWelcomeComponent implements OnInit {
  constructor(protected sideMenuService: SideMenuService) {}

  ngOnInit() {}

  showLeftSideMenu() {
    this.sideMenuService.showLeftSideMenu();
  }
}
