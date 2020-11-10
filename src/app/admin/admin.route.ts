import { SHOULD_BE_LOGIN_RESOLVE } from './../app.route';
import { ObjectsCommonService } from './../objects-client/services/objects-common.service';
import { getParentStateName } from '../app.const';
import { Ng2StateDeclaration, StateService } from '@uirouter/angular';
import {
  ADMIN_ROUTE_NAME,
  ADMIN_OBJECTS_LIST_ROUTE_NAME,
  OBJECT_TREE_TOKEN,
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
    state: ADMIN_OBJECTS_LIST_ROUTE_NAME,
    params: {
      ownerType: 'tenant',
      ownerName: 'demo',
      namespaceType: 'site',
      namespaceName: 'demo',
    },
  },
};
const adminObjectsListState = {
  parent: getParentStateName(ADMIN_OBJECTS_LIST_ROUTE_NAME),
  name: ADMIN_OBJECTS_LIST_ROUTE_NAME,
  url: '/list/:ownerType/:ownerName/:namespaceType/:namespaceName',
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

export const ADMIN_STATES = [adminState, adminObjectsListState];
