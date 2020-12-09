import { viewFutureState } from './../app.lazy.route';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from './../objects-client/services/objects-common.service';
import { OBJECT_TREE_TOKEN } from './../admin/admin.const';
import { ViewComponent } from './view/view.component';
import { VIEW_ROUTE_NAME, VIEW_URI_ROUTE_NAME } from './view.const';
import {
  Ng2StateDeclaration,
  UIView,
  StateService,
  Transition,
  RedirectToResult,
  StateParams,
} from '@uirouter/angular';
import { getParentStateName } from '../app.const';

const viewStateResolve = async (
  objectsCommonService: ObjectsCommonService,
  stateService: StateService
): Promise<ObjectTreeImpl> => {
  const dataTree = stateService.transition.params().dataTree;
  if (dataTree) {
    return dataTree;
  } else {
    let uri: string = stateService.transition.params().uri;
    if (uri) {
      if (uri.startsWith('http%')) {
        return undefined;
      }

      return await objectsCommonService.getTreeByUri(uri);
    }
  }
};

const pageTreeResolve = async (
  objectsCommonService: ObjectsCommonService,
  stateService: StateService,
  dataTree: ObjectTreeImpl
) => {
  const pageTree = stateService.transition.params().pageTree;
  if (pageTree) {
    return pageTree;
  }
  if (dataTree) {
    await dataTree.waitForReady();
    return dataTree.welcomePage;
  }
};

const viewStateRedirectTo = async (
  transition: Transition
): Promise<RedirectToResult> => {
  const uri: string = transition.params().uri;
  if (!uri) {
    const dataTree: ObjectTreeImpl = transition.params().dataTree;
    if (dataTree && dataTree.aliasUri) {
      return {
        state: VIEW_URI_ROUTE_NAME,
        params: {
          uri: dataTree.aliasUri,
          dataTree: transition.params().dataTree,
          pageTree: transition.params().pageTree,
        },
      };
    }
    if (document.head.querySelector('[name~=dataTree][content]')['content']) {
      return {
        state: VIEW_URI_ROUTE_NAME,
        params: {
          uri: document.head.querySelector('[name~=dataTree][content]')[
            'content'
          ],
        },
      };
    }
  }
  if (uri.startsWith('http%')) {
    return {
      state: VIEW_URI_ROUTE_NAME,
      params: {
        uri: decodeURIComponent(uri),
        dataTree: transition.params().dataTree,
        pageTree: transition.params().pageTree,
      },
    };
  }

  if (!transition.params().pageTree && transition.params().dataTree) {
    await transition.params().dataTree.waitForReady();
    if (transition.params().dataTree.welcomePage) {
      return {
        state: VIEW_URI_ROUTE_NAME,
        params: {
          uri: transition.params().uri,
          dataTree: transition.params().dataTree,
          pageTree: transition.params().dataTree.welcomePage,
        },
      };
    }
  }

  return undefined;
};

const viewState: Ng2StateDeclaration = {
  parent: getParentStateName(VIEW_ROUTE_NAME),
  name: VIEW_ROUTE_NAME,
  url: '/view',
  component: UIView,
  params: {
    dataTree: { value: undefined },
    pageTree: { value: undefined },
  },
  redirectTo: viewStateRedirectTo,
};

const viewUriState: Ng2StateDeclaration = {
  parent: getParentStateName(VIEW_URI_ROUTE_NAME),
  name: VIEW_URI_ROUTE_NAME,
  url: '/{uri}',
  component: ViewComponent,
  params: {
    uri: { type: 'string' },
    dataTree: { value: undefined },
    pageTree: { value: undefined },
  },
  resolve: [
    {
      token: OBJECT_TREE_TOKEN,
      deps: [ObjectsCommonService, StateService],
      resolveFn: viewStateResolve,
    },
    {
      token: 'pageTree',
      deps: [ObjectsCommonService, StateService, OBJECT_TREE_TOKEN],
      resolveFn: pageTreeResolve,
    },
  ],
  redirectTo: viewStateRedirectTo,
};

export const VIEW_STATES = [viewState, viewUriState];
