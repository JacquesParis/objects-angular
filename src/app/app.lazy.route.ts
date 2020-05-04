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

export const LAZY_STATES = [rootAdminFutureState, adminFutureState];
