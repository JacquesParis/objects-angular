import {
  ADMIN_NAMESPACE_ROUTE_NAME,
  ADMIN_OWNER_ROUTE_NAME,
} from './../admin.const';
import { StateService } from '@uirouter/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-frames',
  templateUrl: './admin-frames.component.html',
  styleUrls: ['./admin-frames.component.scss'],
})
export class AdminFramesComponent implements OnInit {
  public isWelcomePage: boolean;
  constructor(protected stateService: StateService) {}

  ngOnInit() {
    this.isWelcomePage =
      this.stateService.current.name === ADMIN_OWNER_ROUTE_NAME ||
      this.stateService.current.name === ADMIN_NAMESPACE_ROUTE_NAME;
  }
}
