import { AdminNodeListComponent } from './admin-node/admin-node-list/admin-node-list.component';
import { AdminNodeViewComponent } from './admin-node/admin-node-view/admin-node-view.component';
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
  ADMIN_OWNER_NODE_ROUTE_NAME,
  OBJECT_NODE_TOKEN,
  ADMIN_NAMESPACE_NODE_ROUTE_NAME,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  ADMIN_OWNER_NODE_LIST_ROUTE_NAME,
} from './admin.const';
import { AdminComponent } from './admin/admin.component';
import { ObjectTreeImpl, EntityName } from '@jacquesparis/objects-client';
import { AdminFramesComponent } from './admin-frames/admin-frames.component';
import { AdminNodeComponent } from './admin-node/admin-node.component';
import { RestEntityListService } from '../objects-client/abstract-rest-entity/rest-entity-list.service';
import * as _ from 'lodash-es';

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
  url: '/owner/:ownerType/:ownerName',
  component: AdminFramesComponent,
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

const adminOwnerNodeState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_NODE_ROUTE_NAME),
  name: ADMIN_OWNER_NODE_ROUTE_NAME,
  url: '/node/:treeId',
  abstract: true,
  component: AdminNodeComponent,
  resolve: [
    SHOULD_BE_LOGIN_RESOLVE,
    {
      token: OBJECT_NODE_TOKEN,
      deps: [
        ObjectsCommonService,
        StateService,
        OBJECT_TREE_TOKEN,
        RestEntityListService,
      ],
      resolveFn: async (
        objectsCommonService: ObjectsCommonService,
        stateService: StateService,
        mainObjectTree: ObjectTreeImpl,
        restEntityListService: RestEntityListService
      ): Promise<ObjectTreeImpl> => {
        let objectTree = objectsCommonService.getObjectTreeById(
          stateService.transition.params().treeId
        );
        try {
          if (!objectTree) {
            objectTree = await objectsCommonService.getTreeById(
              stateService.transition.params().treeId
            );
          }
          let parentTreeId = objectTree.treeNode.parentTreeId;
          while (
            parentTreeId &&
            !objectsCommonService.getObjectTreeById(parentTreeId)
          ) {
            const parentTree = await objectsCommonService.getTreeById(
              parentTreeId
            );
            parentTreeId = parentTree && parentTree.treeNode.parentTreeId;
          }
          let parentNodeId = objectTree.treeNode.id;
          while (
            mainObjectTree &&
            parentNodeId &&
            parentNodeId != mainObjectTree.treeNode.id
          ) {
            restEntityListService.setOpen(EntityName.objectTree, parentNodeId);
            parentNodeId =
              objectsCommonService.getObjectTreeById(parentNodeId) &&
              objectsCommonService.getObjectTreeById(parentNodeId).treeNode
                .parentNodeId;
          }
          if (
            mainObjectTree &&
            parentNodeId &&
            parentNodeId === mainObjectTree.treeNode.id
          ) {
            restEntityListService.setOpen(EntityName.objectTree, parentNodeId);
          }
        } catch (error) {}
        return objectTree;
      },
    },
  ],
};

const adminOwnerNodeViewState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_NODE_VIEW_ROUTE_NAME),
  name: ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  url: '',
  component: AdminNodeViewComponent,
};

const adminOwnerNodeListState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_NODE_LIST_ROUTE_NAME),
  name: ADMIN_OWNER_NODE_LIST_ROUTE_NAME,
  url: '',
  component: AdminNodeListComponent,
};

const adminNamespaceState = {
  parent: getParentStateName(ADMIN_NAMESPACE_ROUTE_NAME),
  name: ADMIN_NAMESPACE_ROUTE_NAME,
  url: '/namespace/:namespaceType/:namespaceName',
  component: AdminFramesComponent,
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

const adminNamespaceNodeState: Ng2StateDeclaration = _.merge(
  {},
  adminOwnerNodeState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_ROUTE_NAME,
  }
);

export const ADMIN_STATES = [
  adminState,
  adminOwnerState,
  adminNamespaceState,
  adminOwnerNodeState,
  adminNamespaceNodeState,
  adminOwnerNodeViewState,
  adminOwnerNodeListState,
];
