import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const ADMIN_ROUTE_NAME = buildStateName(ROOT_STATE_NAME, 'admin');
export const ADMIN_OWNER_ROUTE_NAME = buildStateName(
  ADMIN_ROUTE_NAME,
  'owner-list'
);
export const ADMIN_OWNER_WELCOME_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_ROUTE_NAME,
  'welcome'
);
export const ADMIN_OWNER_NODE_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_ROUTE_NAME,
  'node'
);

export const ADMIN_OWNER_NODE_VIEW_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_NODE_ROUTE_NAME,
  'view'
);

export const ADMIN_OWNER_NODE_LIST_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_NODE_ROUTE_NAME,
  'list'
);

export const ADMIN_OWNER_NODE_CREATE_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_NODE_ROUTE_NAME,
  'create'
);
export const ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_NODE_CREATE_ROUTE_NAME,
  'type'
);

export const ADMIN_NAMESPACE_ROUTE_NAME = buildStateName(
  ADMIN_OWNER_ROUTE_NAME,
  'namespace-list'
);
export const ADMIN_NAMESPACE_WELCOME_ROUTE_NAME = buildStateName(
  ADMIN_NAMESPACE_ROUTE_NAME,
  'welcome'
);

export const ADMIN_NAMESPACE_NODE_ROUTE_NAME = buildStateName(
  ADMIN_NAMESPACE_ROUTE_NAME,
  'node'
);

export const ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME = buildStateName(
  ADMIN_NAMESPACE_NODE_ROUTE_NAME,
  'view'
);

export const ADMIN_NAMESPACE_NODE_LIST_ROUTE_NAME = buildStateName(
  ADMIN_NAMESPACE_NODE_ROUTE_NAME,
  'list'
);

export const OBJECT_TREE_TOKEN = 'objectTree';
export const OBJECT_NODE_TOKEN = 'objectNode';
export const OBJECT_NODE_TYPE_TOKEN = 'objectTypeId';
