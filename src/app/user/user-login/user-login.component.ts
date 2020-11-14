import { USER_ACCOUNT_ROUTE_NAME_AND_HREF } from './../user.const';
import { StateService } from '@uirouter/angular';
import { UserService } from './../../objects-client/services/user.service';
import { Component, OnInit } from '@angular/core';
import { IAppUser } from '@jacquesparis/objects-model';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
})
export class UserLoginComponent implements OnInit {
  error: string;
  constructor(
    private userService: UserService,
    private stateService: StateService
  ) {}
  public credentials: IAppUser = {
    email: '',
    password: '',
  };

  ngOnInit() {}
  public async login() {
    try {
      await this.userService.login(this.credentials as any);
      if (this.userService.nextLogInStateName) {
        this.stateService.go(this.userService.nextLogInStateName);
        this.userService.nextLogInStateName = null;
      } else {
        this.stateService.go(USER_ACCOUNT_ROUTE_NAME_AND_HREF.stateName);
      }
    } catch (error) {
      this.error = error.message ? error.message : 'Unexpected error';
    }
  }
}
