import {
  ROOT_STATE_NAME,
  WELCOME_STATE_NAME,
  buildStateName,
} from './app.const';
import { UIView, Ng2StateDeclaration } from '@uirouter/angular';
import { AppComponent } from './app.component';
import { ObjectsCommonService } from './objects-client/services/objects-common.service';
import { getParentStateName } from './app.const';
const WELCOME_STATE_NAME2 = buildStateName(WELCOME_STATE_NAME, '2');

const rootState: Ng2StateDeclaration = {
  name: ROOT_STATE_NAME,
  url: '',
  component: UIView,
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
};

const rootApp2State: Ng2StateDeclaration = {
  name: WELCOME_STATE_NAME2,
  parent: getParentStateName(WELCOME_STATE_NAME2),
  url: '/',
  redirectTo: WELCOME_STATE_NAME,
};

export const APP_STATES = [rootState, rootAppState, rootApp2State];
