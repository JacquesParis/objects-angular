import { getSiteId, uriDecode } from 'src/app/app.const';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from './../objects-client/services/objects-common.service';
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
  let siteTree = stateService.transition.params().siteTree;
  let siteId = uriDecode(stateService.transition.params().siteId);
  if (!siteId || 'default' === siteId) {
    siteId = getSiteId();
  }
  if (siteTree) {
    return siteTree;
  } else if (siteId) {
    siteTree = await objectsCommonService.getOrSearchObjectTreeById(siteId);
    return siteTree;
  }
};

const pageTreeResolve = async (
  objectsCommonService: ObjectsCommonService,
  stateService: StateService,
  siteTree: ObjectTreeImpl
) => {
  let pageTree = stateService.transition.params().pageTree;
  const pageId = stateService.transition.params().pageId;
  if (pageTree) {
    return pageTree;
  } else if (pageId && 'default' !== pageId) {
    pageTree = await objectsCommonService.getOrSearchObjectTreeById(pageId);
    if (pageTree) {
      return pageTree;
    }
  }

  let siteId = uriDecode(stateService.transition.params().siteId);
  if (!siteId || 'default' === siteId) {
    siteId = getSiteId();
  }
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
  if (transition.to().name !== VIEW_PAGE_ROUTE_NAME) {
    const siteId: string = uriDecode(transition.params().siteId);
    if (!siteId) {
      const siteTree: ObjectTreeImpl = transition.params().siteTree;
      if (siteTree) {
        return {
          state: VIEW_PAGE_ROUTE_NAME,
          params: {
            siteId: siteTree.id,
            siteTree: transition.params().siteTree,
            pageTree: transition.params().pageTree,
            pageId: transition.params().pageId || 'default',
            siteName: transition.params().siteTree?.treeNode?.name || 'default',
            pageName: transition.params().pageTree?.treeNode?.name || 'default',
          },
        };
      }

      return {
        state: VIEW_PAGE_ROUTE_NAME,
        params: {
          siteId: getSiteId(),
          pageId: 'default',
          siteName: 'default',
          pageName: 'default',
        },
      };
    }
  }
  /*
  const pageId: string = transition.params().pageId;

  if (!pageId || 'default' === pageId) {
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

    let siteTree: ObjectTreeImpl = transition.params().siteTree;
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
        pageId: pageId || 'default',
        siteTree: transition.params().siteTree,
        pageTree: transition.params().pageTree,
        siteName: transition.params().siteTree?.treeNode?.name || 'default',
        pageName: transition.params().pageName || 'default',
      },
    };
  }*/

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
  redirectTo: {
    state: VIEW_PAGE_ROUTE_NAME,
    params: {
      siteId: 'default',
      pageId: 'default',
    },
  },
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
  //  redirectTo: viewStateRedirectTo,
};

const viewPageState: Ng2StateDeclaration = {
  parent: getParentStateName(VIEW_PAGE_ROUTE_NAME),
  name: VIEW_PAGE_ROUTE_NAME,
  url: '/{pageId}',
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
  // redirectTo: viewStateRedirectTo,
};

export const VIEW_STATES = [viewState, viewSiteState, viewPageState];
