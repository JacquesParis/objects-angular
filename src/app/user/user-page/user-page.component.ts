import { WELCOME_STATE_NAME } from './../../app.const';
import {
  USER_LOGIN_ROUTE_NAME_AND_HREF,
  USER_REGISTRATION_ROUTE_NAME_AND_HREF,
} from './../user.const';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
})
export class UserPageComponent implements OnInit {
  public loginRootName = USER_LOGIN_ROUTE_NAME_AND_HREF.stateName;
  public registerRootName = USER_REGISTRATION_ROUTE_NAME_AND_HREF.stateName;
  public welcomeRootName = WELCOME_STATE_NAME;

  constructor() {}

  ngOnInit() {}
}
