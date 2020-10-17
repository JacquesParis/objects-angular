import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const ROOT_ADMIN_ROUTE_NAME = buildStateName(
  ROOT_STATE_NAME,
  'root-admin'
);
export const ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME = buildStateName(
  ROOT_ADMIN_ROUTE_NAME,
  'object-types'
);
export const ROOT_ADMIN_OBJECTS_LIST_ROUTE_NAME = buildStateName(
  ROOT_ADMIN_ROUTE_NAME,
  'objects'
);
