import {
  USER_ACCOUNT_TOKEN,
  USER_LOGIN_ROUTE_NAME_AND_HREF,
} from './../user.const';
import { StateService } from '@uirouter/angular';
import { UserService } from './../../objects-client/services/user.service';
import { AppUserImpl } from '@jacquesparis/objects-client';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss'],
})
export class UserAccountComponent implements OnInit {
  error: any;
  constructor(
    @Inject(USER_ACCOUNT_TOKEN) public user: AppUserImpl,
    private userService: UserService,
    private stateService: StateService
  ) {}

  ngOnInit() {}

  async logout() {
    try {
      await this.userService.logout();
      this.stateService.go(USER_LOGIN_ROUTE_NAME_AND_HREF.stateName);
    } catch (error) {
      this.error = error.message ? error.message : 'Unexpected error';
    }
  }
}
