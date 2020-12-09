import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const VIEW_ROUTE_NAME = buildStateName(ROOT_STATE_NAME, 'view');
export const VIEW_URI_ROUTE_NAME = buildStateName(VIEW_ROUTE_NAME, 'uri');
