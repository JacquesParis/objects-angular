import { ROOT_STATE_NAME, getParentStateName } from './app.const';
import { ROOT_ADMIN_ROUTE_NAME } from './root-admin/root-admin.const';
import { RootAdminModule } from './root-admin/root-admin.module';
export const rootAdminFutureState = {
  parent: getParentStateName(ROOT_ADMIN_ROUTE_NAME),
  name: ROOT_ADMIN_ROUTE_NAME + '.**',
  url: '/root-admin',
  loadChildren: () =>
    import('./root-admin/root-admin.module').then((mod) => mod.RootAdminModule),
};

export const LAZY_STATES = [rootAdminFutureState];
