import { ObjectsCommonService } from './objects-common.service';
import { StateService } from '@uirouter/angular';
import {
  USER_LOGIN_ROUTE_NAME_AND_HREF,
  USER_ACCOUNT_ROUTE_NAME_AND_HREF,
} from './../../user/user.const';
import { HttpRestService } from './../../common-app/services/http-rest.service';
import { ConfigurationService } from './../../common-app/services/configuration.service';
import { Injectable } from '@angular/core';
import { AppUserImpl, AppUserService } from '@jacquesparis/objects-client';
import { RawParams, StateObject } from '@uirouter/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private appUserService: AppUserService;
  private nextLogInState: { stateName: string; params: RawParams };
  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService
  ) {
    this.appUserService = this.objectsCommonService.objectClient.appUserService;
  }

  public login(credentials: {
    email: string;
    password: string;
  }): Promise<AppUserImpl> {
    return this.appUserService.login(credentials);
  }

  logout(): Promise<void> {
    return this.appUserService.logout();
  }

  public isUserLoguedIn(): Promise<boolean | AppUserImpl> {
    return this.appUserService.isUserLoguedIn();
  }

  public async resolveMandatoryLogin(): Promise<void> {
    if (!(await this.isUserLoguedIn())) {
      this.nextLogInState = {
        stateName: this.stateService.transition.to().name,
        params: this.stateService.transition.params(),
      };
      location.href = USER_LOGIN_ROUTE_NAME_AND_HREF.href;
      return Promise.reject();
    }
    return Promise.resolve();
  }

  public redirectAfterLogin() {
    if (this.nextLogInState) {
      this.stateService.go(
        this.nextLogInState.stateName,
        this.nextLogInState.params
      );
      this.nextLogInState = undefined;
    } else {
      this.stateService.go(USER_ACCOUNT_ROUTE_NAME_AND_HREF.stateName);
    }
  }
}
