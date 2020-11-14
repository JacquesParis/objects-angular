import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const ADMIN_ROUTE_NAME = buildStateName(ROOT_STATE_NAME, 'admin');
export const ADMIN_OWNER_ROUTE_NAME = buildStateName(
  ADMIN_ROUTE_NAME,
  'owner-list'
);
export const ADMIN_NAMESPACE_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_ROUTE_NAME,
  'namespace-list'
);
export const OBJECT_TREE_TOKEN = 'objectTree';
