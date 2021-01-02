import { getOwnerName } from 'src/app/app.const';
import { SHOULD_BE_LOGIN_RESOLVE } from './../app.route';
import { ObjectsCommonService } from './../objects-client/services/objects-common.service';
import { getParentStateName } from '../app.const';
import { Ng2StateDeclaration, StateService } from '@uirouter/angular';
import {
  ADMIN_ROUTE_NAME,
  ADMIN_NAMESPACE_ROUTE_NAME,
  OBJECT_TREE_TOKEN,
  ADMIN_OWNER_ROUTE_NAME,
} from './admin.const';
import { AdminComponent } from './admin/admin.component';
import { ObjectNodesListComponent } from './admin/object-nodes-list/object-nodes-list.component';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';

const adminState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_ROUTE_NAME),
  name: ADMIN_ROUTE_NAME,
  url: '/admin',
  component: AdminComponent,
  redirectTo: {
    state: ADMIN_OWNER_ROUTE_NAME,
    params: {
      ownerType: 'Tenant',
      ownerName: getOwnerName(),
    },
  },
};
const adminOwnerState = {
  parent: getParentStateName(ADMIN_OWNER_ROUTE_NAME),
  name: ADMIN_OWNER_ROUTE_NAME,
  url: '/list/:ownerType/:ownerName',
  component: ObjectNodesListComponent,
  resolve: [
    SHOULD_BE_LOGIN_RESOLVE,
    {
      token: OBJECT_TREE_TOKEN,
      deps: [ObjectsCommonService, StateService],
      resolveFn: (
        objectsCommonService: ObjectsCommonService,
        stateService: StateService
      ): Promise<ObjectTreeImpl> => {
        return objectsCommonService.getOwnerTree(
          stateService.transition.params().ownerType,
          stateService.transition.params().ownerName
        );
      },
    },
  ],
};

const adminNamespaceState = {
  parent: getParentStateName(ADMIN_NAMESPACE_ROUTE_NAME),
  name: ADMIN_NAMESPACE_ROUTE_NAME,
  url: '/:namespaceType/:namespaceName',
  component: ObjectNodesListComponent,
  resolve: [
    SHOULD_BE_LOGIN_RESOLVE,
    {
      token: OBJECT_TREE_TOKEN,
      deps: [ObjectsCommonService, StateService],
      resolveFn: (
        objectsCommonService: ObjectsCommonService,
        stateService: StateService
      ): Promise<ObjectTreeImpl> => {
        return objectsCommonService.getNamespaceTree(
          stateService.transition.params().ownerType,
          stateService.transition.params().ownerName,
          stateService.transition.params().namespaceType,
          stateService.transition.params().namespaceName
        );
      },
    },
  ],
};

export const ADMIN_STATES = [adminState, adminOwnerState, adminNamespaceState];
