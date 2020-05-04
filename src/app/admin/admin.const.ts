import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const ADMIN_ROUTE_NAME = buildStateName(ROOT_STATE_NAME, 'admin');
export const ADMIN_OBJECT_TYPE_ROUTE_NAME = buildStateName(
  ADMIN_ROUTE_NAME,
  'object-type'
);
export const ADMIN_OBJECT_NAME_ROUTE_NAME = buildStateName(
  ADMIN_OBJECT_TYPE_ROUTE_NAME,
  'object-name'
);
export const ADMIN_OBJECTS_LIST_ROUTE_NAME = buildStateName(
  ADMIN_OBJECT_NAME_ROUTE_NAME,
  'list'
);
