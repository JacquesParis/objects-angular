import { VIEW_ROUTE_NAME } from './view/view.const';
import { USER_ROUTE_NAME_AND_HREF } from './user/user.const';
import { getParentStateName } from './app.const';
import { ROOT_ADMIN_ROUTE_NAME } from './root-admin/root-admin.const';
import { ADMIN_ROUTE_NAME } from './admin/admin.const';

export const rootAdminFutureState = {
  parent: getParentStateName(ROOT_ADMIN_ROUTE_NAME),
  name: ROOT_ADMIN_ROUTE_NAME + '.**',
  url: '/root-admin',
  loadChildren: () =>
    import('./root-admin/root-admin.module').then((mod) => mod.RootAdminModule),
};

export const adminFutureState = {
  parent: getParentStateName(ADMIN_ROUTE_NAME),
  name: ADMIN_ROUTE_NAME + '.**',
  url: '/admin',
  loadChildren: () =>
    import('./admin/admin.module').then((mod) => mod.AdminModule),
};

export const userFutureState = {
  parent: getParentStateName(USER_ROUTE_NAME_AND_HREF.stateName),
  name: USER_ROUTE_NAME_AND_HREF.stateName + '.**',
  url: '/user',
  loadChildren: () =>
    import('./user/user.module').then((mod) => mod.UserModule),
};

export const viewFutureState = {
  parent: getParentStateName(VIEW_ROUTE_NAME),
  name: VIEW_ROUTE_NAME + '.**',
  url: '/view',
  loadChildren: () =>
    import('./view/view.module').then((mod) => mod.ViewModule),
};

export const LAZY_STATES = [
  rootAdminFutureState,
  adminFutureState,
  userFutureState,
  viewFutureState,
];
