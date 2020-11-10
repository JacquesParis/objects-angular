import { AppUserImpl } from '@jacquesparis/objects-client';
import { UserService } from './../objects-client/services/user.service';
import { UserAccountComponent } from './user-account/user-account.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserLoginComponent } from './user-login/user-login.component';
import {
  USER_ACCOUNT_TOKEN,
  USER_ROUTE_NAME_AND_HREF,
  USER_LOGIN_ROUTE_NAME_AND_HREF,
  USER_REGISTRATION_ROUTE_NAME_AND_HREF,
  USER_ACCOUNT_ROUTE_NAME_AND_HREF,
} from './user.const';
import { getParentStateName } from '../app.const';
import { Ng2StateDeclaration, StateService } from '@uirouter/angular';

export const userState: Ng2StateDeclaration = {
  parent: getParentStateName(USER_ROUTE_NAME_AND_HREF.stateName),
  name: USER_ROUTE_NAME_AND_HREF.stateName,
  url: USER_ROUTE_NAME_AND_HREF.url,
  redirectTo: USER_LOGIN_ROUTE_NAME_AND_HREF.stateName,
  component: UserPageComponent,
};

const userLoginStateResolve = async (
  userService: UserService,
  stateService: StateService
): Promise<void> => {
  const user = await userService.isUserLoguedIn();
  if (user) {
    stateService.go(userAccountState.name);
  }
  return;
};

export const userLoginState: Ng2StateDeclaration = {
  parent: getParentStateName(USER_LOGIN_ROUTE_NAME_AND_HREF.stateName),
  name: USER_LOGIN_ROUTE_NAME_AND_HREF.stateName,
  url: USER_LOGIN_ROUTE_NAME_AND_HREF.url,
  component: UserLoginComponent,
  resolve: [
    {
      token: USER_ACCOUNT_TOKEN,
      deps: [UserService, StateService],
      resolveFn: userLoginStateResolve,
    },
  ],
};

const userRegistrationStateResolve = async (
  userService: UserService,
  stateService: StateService
): Promise<void> => {
  const user = await userService.isUserLoguedIn();
  if (user) {
    stateService.go(userAccountState.name);
  }
  return;
};

export const userRegistrationState: Ng2StateDeclaration = {
  parent: getParentStateName(USER_REGISTRATION_ROUTE_NAME_AND_HREF.stateName),
  name: USER_REGISTRATION_ROUTE_NAME_AND_HREF.stateName,
  url: USER_REGISTRATION_ROUTE_NAME_AND_HREF.url,
  component: UserRegistrationComponent,
  resolve: [
    {
      token: USER_ACCOUNT_TOKEN,
      deps: [UserService, StateService],
      resolveFn: userRegistrationStateResolve,
    },
  ],
};

const userAccountStateResolve = async (
  userService: UserService,
  stateService: StateService
): Promise<AppUserImpl> => {
  const user = await userService.isUserLoguedIn();
  if (!user) {
    stateService.go(userLoginState.name);
  }
  return user as AppUserImpl;
};

export const userAccountState: Ng2StateDeclaration = {
  parent: getParentStateName(USER_ACCOUNT_ROUTE_NAME_AND_HREF.stateName),
  name: USER_ACCOUNT_ROUTE_NAME_AND_HREF.stateName,
  url: USER_ACCOUNT_ROUTE_NAME_AND_HREF.url,
  component: UserAccountComponent,
  resolve: [
    {
      token: USER_ACCOUNT_TOKEN,
      deps: [UserService, StateService],
      resolveFn: userAccountStateResolve,
    },
  ],
};

export const USER_STATES = [
  userState,
  userLoginState,
  userRegistrationState,
  userAccountState,
];
