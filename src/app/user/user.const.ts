import {
  buildStateAndHref,
  buildStateAndRootHref,
  buildStateName,
  ROOT_STATE_NAME,
} from '../app.const';
export const USER_ROUTE_NAME_AND_HREF = buildStateAndRootHref(
  ROOT_STATE_NAME,
  'user'
);
export const USER_LOGIN_ROUTE_NAME_AND_HREF = buildStateAndHref(
  USER_ROUTE_NAME_AND_HREF,
  'login'
);
export const USER_ACCOUNT_ROUTE_NAME_AND_HREF = buildStateAndHref(
  USER_ROUTE_NAME_AND_HREF,
  'account'
);
export const USER_REGISTRATION_ROUTE_NAME_AND_HREF = buildStateAndHref(
  USER_ROUTE_NAME_AND_HREF,
  'registration'
);

export const USER_ACCOUNT_TOKEN = 'USER_ACCOUNT_TOKEN';
