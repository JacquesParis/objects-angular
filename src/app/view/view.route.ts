import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from './../objects-client/services/objects-common.service';
import { OBJECT_TREE_TOKEN } from './../admin/admin.const';
import { ViewComponent } from './view/view.component';
import {
  VIEW_ROUTE_NAME,
  VIEW_PAGE_ROUTE_NAME,
  VIEW_SITE_ROUTE_NAME,
} from './view.const';
import {
  Ng2StateDeclaration,
  UIView,
  StateService,
  Transition,
  RedirectToResult,
} from '@uirouter/angular';
import { getParentStateName } from '../app.const';

const siteTreeResolve = async (
  objectsCommonService: ObjectsCommonService,
  stateService: StateService
): Promise<ObjectTreeImpl> => {
  const siteTree = stateService.transition.params().siteTree;
  const siteId = stateService.transition.params().siteId;
  if (siteTree && siteTree.id === siteId) {
    return siteTree;
  } else if (siteId) {
    return objectsCommonService.getOrSearchObjectTreeById(siteId);
  }
};

const pageTreeResolve = async (
  objectsCommonService: ObjectsCommonService,
  stateService: StateService,
  siteTree: ObjectTreeImpl
) => {
  let pageTree = stateService.transition.params().pageTree;
  const pageId = stateService.transition.params().pageId;
  if (pageTree && pageId === pageTree.id) {
    return pageTree;
  } else if (pageId) {
    pageTree = await objectsCommonService.getOrSearchObjectTreeById(pageId);
    if (pageTree) {
      return pageTree;
    }
  }

  const siteId = stateService.transition.params().siteId;
  if (!siteTree && siteId) {
    siteTree = await objectsCommonService.getOrSearchObjectTreeById(siteId);
  }

  if (siteTree) {
    await siteTree.waitForReady();
    if (siteTree.welcomePage) {
      return siteTree.welcomePage;
    }
  }
};

const viewStateRedirectTo = async (
  transition: Transition
): Promise<RedirectToResult> => {
  const siteId: string = transition.params().siteId;
  if (!siteId) {
    const siteTree: ObjectTreeImpl = transition.params().siteTree;
    if (siteTree) {
      return {
        state: VIEW_SITE_ROUTE_NAME,
        params: {
          siteId: siteTree.id,
          siteTree: transition.params().siteTree,
          pageTree: transition.params().pageTree,
        },
      };
    }
    if (document.head.querySelector('[name~=siteTreeId][content]')['content']) {
      return {
        state: VIEW_SITE_ROUTE_NAME,
        params: {
          siteId: document.head.querySelector('[name~=siteTreeId][content]')[
            'content'
          ],
        },
      };
    }
  }

  const pageId: string = transition.params().pageId;

  if (!pageId) {
    const pageTree = transition.params().pageTree;
    if (pageTree) {
      return {
        state: VIEW_PAGE_ROUTE_NAME,
        params: {
          siteId: siteId,
          pageId: pageTree.id,
          siteTree: transition.params().siteTree,
          pageTree: pageTree,
          siteName: transition.params().siteTree.treeNode.name,
          pageName: pageTree.treeNode.name,
        },
      };
    }

    const siteTree: ObjectTreeImpl = transition.params().siteTree;
    if (siteTree) {
      await siteTree.waitForReady();
      if (siteTree.welcomePage) {
        return {
          state: VIEW_PAGE_ROUTE_NAME,
          params: {
            siteId: siteTree.id,
            pageId: siteTree.welcomePage.id,
            siteTree: siteTree,
            pageTree: siteTree.welcomePage,
            siteName: siteTree.treeNode.name,
            pageName: siteTree.welcomePage.treeNode.name,
          },
        };
      }
    }
  }

  if (pageId && siteId && transition.to().name !== VIEW_PAGE_ROUTE_NAME) {
    return {
      state: VIEW_PAGE_ROUTE_NAME,
      params: {
        siteId: siteId,
        pageId: pageId,
        siteTree: transition.params().siteTree,
        pageTree: transition.params().pageTree,
        siteName: transition.params().siteTree.treeNode.name,
        pageName: transition.params().pageName,
      },
    };
  }

  return undefined;
};

const viewState: Ng2StateDeclaration = {
  parent: getParentStateName(VIEW_ROUTE_NAME),
  name: VIEW_ROUTE_NAME,
  url: '/view',
  component: UIView,
  params: {
    siteTree: { value: undefined },
    pageTree: { value: undefined },
  },
  redirectTo: viewStateRedirectTo,
};

const viewSiteState: Ng2StateDeclaration = {
  parent: getParentStateName(VIEW_SITE_ROUTE_NAME),
  name: VIEW_SITE_ROUTE_NAME,
  url: '/{siteId}',
  component: UIView,
  params: {
    siteTree: { value: undefined },
    pageTree: { value: undefined },
  },
  resolve: [
    {
      token: 'siteTree',
      deps: [ObjectsCommonService, StateService],
      resolveFn: siteTreeResolve,
    },
  ],
  redirectTo: viewStateRedirectTo,
};

const viewPageState: Ng2StateDeclaration = {
  parent: getParentStateName(VIEW_PAGE_ROUTE_NAME),
  name: VIEW_PAGE_ROUTE_NAME,
  url: '/{pageId}/{siteName}/{pageName}',
  component: ViewComponent,
  params: {
    siteTree: { value: undefined },
    pageTree: { value: undefined },
  },
  resolve: [
    {
      token: 'pageTree',
      deps: [ObjectsCommonService, StateService, 'siteTree'],
      resolveFn: pageTreeResolve,
    },
  ],
  redirectTo: viewStateRedirectTo,
};

export const VIEW_STATES = [viewState, viewSiteState, viewPageState];
