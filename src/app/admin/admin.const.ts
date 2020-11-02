import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const ADMIN_ROUTE_NAME = buildStateName(ROOT_STATE_NAME, 'admin');
export const ADMIN_OBJECTS_LIST_ROUTE_NAME = buildStateName(
  ADMIN_ROUTE_NAME,
  'objects-list'
);
export const OBJECT_TREE_TOKEN = 'objectTree';
