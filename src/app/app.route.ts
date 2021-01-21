import { USER_LOGIN_ROUTE_NAME_AND_HREF } from './user/user.const';
import { UserService } from './objects-client/services/user.service';
import {
  ROOT_STATE_NAME,
  WELCOME_STATE_NAME,
  buildStateName,
  getRootState,
} from './app.const';
import { UIView, Ng2StateDeclaration, StateService } from '@uirouter/angular';
import { AppComponent } from './app.component';
import { ObjectsCommonService } from './objects-client/services/objects-common.service';
import { getParentStateName } from './app.const';
import { AppRootComponent } from './common-app/app-root/app-root.component';
const WELCOME_STATE_NAME2 = buildStateName(WELCOME_STATE_NAME, '2');

const shouldBeLoginResolve = async (
  userService: UserService,
  stateService: StateService
): Promise<void> => {
  return userService.resolveMandatoryLogin();
};

export const SHOULD_BE_LOGIN_RESOLVE = {
  token: 'shouldBeLogin',
  deps: [UserService, StateService],
  resolveFn: shouldBeLoginResolve,
};

const rootState: Ng2StateDeclaration = {
  name: ROOT_STATE_NAME,
  url: '',
  component: AppRootComponent,
  abstract: true,
  resolve: [
    {
      token: 'initCommonService',
      deps: [ObjectsCommonService],
      resolveFn: (objectsCommonService: ObjectsCommonService) => {
        return objectsCommonService.init();
      },
    },
  ],
};

const rootAppState: Ng2StateDeclaration = {
  name: WELCOME_STATE_NAME,
  parent: getParentStateName(WELCOME_STATE_NAME),
  url: '',
  component: AppComponent,
  redirectTo: getRootState(),
};

const rootApp2State: Ng2StateDeclaration = {
  name: WELCOME_STATE_NAME2,
  parent: getParentStateName(WELCOME_STATE_NAME2),
  url: '/',
  redirectTo: WELCOME_STATE_NAME,
};

export const APP_STATES = [rootState, rootAppState, rootApp2State];
