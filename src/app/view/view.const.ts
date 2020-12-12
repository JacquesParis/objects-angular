import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const VIEW_ROUTE_NAME = buildStateName(ROOT_STATE_NAME, 'view');
export const VIEW_SITE_ROUTE_NAME = buildStateName(VIEW_ROUTE_NAME, 'site');
export const VIEW_PAGE_ROUTE_NAME = buildStateName(
  VIEW_SITE_ROUTE_NAME,
  'page'
);
