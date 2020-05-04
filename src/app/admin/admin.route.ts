import { getParentStateName } from '../app.const';
import { Ng2StateDeclaration } from '@uirouter/angular';
import {
  ADMIN_ROUTE_NAME,
  ADMIN_OBJECTS_LIST_ROUTE_NAME,
  ADMIN_OBJECT_TYPE_ROUTE_NAME,
} from './admin.const';
import { AdminComponent } from './admin/admin.component';
import { ADMIN_OBJECT_NAME_ROUTE_NAME } from './admin.const';
import { ObjectNodesListComponent } from './admin/object-nodes-list/object-nodes-list.component';

const adminState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_ROUTE_NAME),
  name: ADMIN_ROUTE_NAME,
  url: '/admin',
  component: AdminComponent,
  redirectTo: {
    state: ADMIN_OBJECTS_LIST_ROUTE_NAME,
    params: { objectType: 'site', objectName: 'demo' },
  },
};

const adminObjectTypeState = {
  parent: getParentStateName(ADMIN_OBJECT_TYPE_ROUTE_NAME),
  name: ADMIN_OBJECT_TYPE_ROUTE_NAME,
  url: '/list/:objectType',
  abstract: true,
};
const adminObjectNameState = {
  parent: getParentStateName(ADMIN_OBJECT_NAME_ROUTE_NAME),
  name: ADMIN_OBJECT_NAME_ROUTE_NAME,
  url: '/:objectName',
  abstract: true,
};
const adminObjectsListState = {
  parent: getParentStateName(ADMIN_OBJECTS_LIST_ROUTE_NAME),
  name: ADMIN_OBJECTS_LIST_ROUTE_NAME,
  url: '',
  component: ObjectNodesListComponent,
};

export const ADMIN_STATES = [
  adminState,
  adminObjectTypeState,
  adminObjectNameState,
  adminObjectsListState,
];
