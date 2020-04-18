import { RootAdminComponent } from './root-admin/root-admin.component';
import {
  ROOT_ADMIN_ROUTE_NAME,
  ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME,
} from './root-admin.const';
import { getParentStateName } from '../app.const';
import { Ng2StateDeclaration } from '@uirouter/angular';
import { ObjectTypesListComponent } from './object-types-list/object-types-list.component';

const rootAdminState: Ng2StateDeclaration = {
  parent: getParentStateName(ROOT_ADMIN_ROUTE_NAME),
  name: ROOT_ADMIN_ROUTE_NAME,
  url: '/root-admin',
  component: RootAdminComponent,
  redirectTo: ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME,
};

const rootAdminObjectTypesListState = {
  parent: getParentStateName(ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME),
  name: ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME,
  url: '/list',
  component: ObjectTypesListComponent,
};

export const ROOT_ADMIN_STATES = [
  rootAdminState,
  rootAdminObjectTypesListState,
];
