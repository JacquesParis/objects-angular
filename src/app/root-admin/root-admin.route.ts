import { SHOULD_BE_LOGIN_RESOLVE } from './../app.route';
import { USER_LOGIN_ROUTE_NAME_AND_HREF } from './../user/user.const';
import { UserService } from './../objects-client/services/user.service';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { OBJECT_TREE_TOKEN } from './../admin/admin.const';
import { ObjectNodesListComponent } from './../admin/admin/object-nodes-list/object-nodes-list.component';
import { RootAdminComponent } from './root-admin/root-admin.component';
import {
  ROOT_ADMIN_ROUTE_NAME,
  ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME,
  ROOT_ADMIN_OBJECTS_LIST_ROUTE_NAME,
} from './root-admin.const';
import { getParentStateName } from '../app.const';
import { Ng2StateDeclaration, StateService } from '@uirouter/angular';
import { ObjectTypesListComponent } from './object-types-list/object-types-list.component';
import { ObjectsCommonService } from '../objects-client/services/objects-common.service';

const rootAdminState: Ng2StateDeclaration = {
  parent: getParentStateName(ROOT_ADMIN_ROUTE_NAME),
  name: ROOT_ADMIN_ROUTE_NAME,
  url: '/root-admin',
  component: RootAdminComponent,
  redirectTo: ROOT_ADMIN_OBJECTS_LIST_ROUTE_NAME,
  resolve: [SHOULD_BE_LOGIN_RESOLVE],
};

const rootAdminObjectTypesListState = {
  parent: getParentStateName(ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME),
  name: ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME,
  url: '/types',
  component: ObjectTypesListComponent,
  resolve: [SHOULD_BE_LOGIN_RESOLVE],
};

const rootAdminObjectsListStateRsolve = (
  objectsCommonService: ObjectsCommonService
): Promise<ObjectTreeImpl> => {
  return objectsCommonService.getOwnerTree('Repository', 'root');
};

const rootAdminObjectsListState = {
  parent: getParentStateName(ROOT_ADMIN_OBJECTS_LIST_ROUTE_NAME),
  name: ROOT_ADMIN_OBJECTS_LIST_ROUTE_NAME,
  url: '/objects',
  component: ObjectNodesListComponent,
  resolve: [
    SHOULD_BE_LOGIN_RESOLVE,
    {
      token: OBJECT_TREE_TOKEN,
      deps: [ObjectsCommonService],
      resolveFn: rootAdminObjectsListStateRsolve,
    },
  ],
};

export const ROOT_ADMIN_STATES = [
  rootAdminState,
  rootAdminObjectTypesListState,
  rootAdminObjectsListState,
];
