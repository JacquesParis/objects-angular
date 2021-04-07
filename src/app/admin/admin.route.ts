import { AdminNodeActionComponent } from './admin-node/admin-node-action/admin-node-action.component';
import { AdminNodeMoveComponent } from './admin-node/admin-node-move/admin-node-move.component';
import { AdminNodeCreateComponent } from './admin-node/admin-node-create/admin-node-create.component';
import { AdminWelcomeComponent } from './admin-frames/admin-welcome/admin-welcome.component';
import { AdminNodeListComponent } from './admin-node/admin-node-list/admin-node-list.component';
import { AdminNodeViewComponent } from './admin-node/admin-node-view/admin-node-view.component';
import { getAdminParts, getOwnerName } from 'src/app/app.const';
import { SHOULD_BE_LOGIN_RESOLVE } from './../app.route';
import { ObjectsCommonService } from './../objects-client/services/objects-common.service';
import { getParentStateName } from '../app.const';
import { Ng2StateDeclaration, StateService, UIView } from '@uirouter/angular';
import {
  OBJECT_TREE_TOKEN,
  ADMIN_ROUTE_NAME,
  ADMIN_NAMESPACE_ROUTE_NAME,
  ADMIN_OWNER_ROUTE_NAME,
  ADMIN_OWNER_NODE_ROUTE_NAME,
  OBJECT_NODE_TOKEN,
  ADMIN_NAMESPACE_NODE_ROUTE_NAME,
  ADMIN_NAMESPACE_ENTRY_ROUTE_NAME,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  ADMIN_OWNER_NODE_LIST_ROUTE_NAME,
  ADMIN_OWNER_WELCOME_ROUTE_NAME,
  ADMIN_NAMESPACE_WELCOME_ROUTE_NAME,
  ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME,
  ADMIN_OWNER_NODE_CREATE_ROUTE_NAME,
  OBJECT_NODE_TYPE_TOKEN,
  ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_LIST_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_CREATE_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_CREATE_TYPE_ROUTE_NAME,
  ADMIN_OWNER_ENTRY_ROUTE_NAME,
  ADMIN_OWNER_NODE_MOVE_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_MOVE_ROUTE_NAME,
  ADMIN_OWNER_NODE_ACTION_ROUTE_NAME,
  ADMIN_NAMESPACE_NODE_ACTION_ROUTE_NAME,
  OBJECT_NODE_METHOD_TOKEN,
} from './admin.const';
import { AdminComponent } from './admin/admin.component';
import { ObjectTreeImpl, EntityName } from '@jacquesparis/objects-client';
import { AdminFramesComponent } from './admin-frames/admin-frames.component';
import { AdminNodeComponent } from './admin-node/admin-node.component';
import { RestEntityListService } from '../objects-client/abstract-rest-entity/rest-entity-list.service';
import { merge, indexOf, map } from 'lodash-es';
import { IEntityMethod } from '@jacquesparis/objects-model';

const adminState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_ROUTE_NAME),
  name: ADMIN_ROUTE_NAME,
  url: '/admin',
  component: AdminComponent,
  redirectTo: () => {
    const parts: {
      ownerType: string;
      ownerName: string;
      namespaceType?: string;
      namespaceName?: string;
    } = getAdminParts();
    if (!parts.namespaceName || !parts.namespaceType) {
      return {
        state: ADMIN_OWNER_WELCOME_ROUTE_NAME,
        params: {
          ownerType: parts.ownerType,
          ownerName: parts.ownerName,
        },
      };
    }

    return {
      state: ADMIN_NAMESPACE_WELCOME_ROUTE_NAME,
      params: {
        ownerType: parts.ownerType,
        ownerName: parts.ownerName,
        namespaceType: parts.namespaceType,
        namespaceName: parts.namespaceName,
      },
    };
  },
};
const adminOwnerState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_ROUTE_NAME),
  name: ADMIN_OWNER_ROUTE_NAME,
  url: '/owner/:ownerType/:ownerName',
  abstract: true,
  component: UIView,
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

const adminOwnerEntryState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_ENTRY_ROUTE_NAME),
  name: ADMIN_OWNER_ENTRY_ROUTE_NAME,
  url: '',
  abstract: true,
  component: AdminFramesComponent,
};

const adminOwnerWelcomeState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_WELCOME_ROUTE_NAME),
  name: ADMIN_OWNER_WELCOME_ROUTE_NAME,
  url: '',
  component: AdminWelcomeComponent,
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
  url: '/list',
  component: AdminNodeListComponent,
};

const adminOwnerNodeCreateState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_NODE_CREATE_ROUTE_NAME),
  name: ADMIN_OWNER_NODE_CREATE_ROUTE_NAME,
  url: '/create',
  component: UIView,
};

const adminOwnerNodeCreateTypeState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME),
  name: ADMIN_OWNER_NODE_CREATE_TYPE_ROUTE_NAME,
  url: '/:typeId',
  component: AdminNodeCreateComponent,

  resolve: [
    SHOULD_BE_LOGIN_RESOLVE,
    {
      token: OBJECT_NODE_TYPE_TOKEN,
      deps: [StateService, OBJECT_NODE_TOKEN],
      resolveFn: async (
        stateService: StateService,
        nodeObjectTree: ObjectTreeImpl
      ): Promise<ObjectTreeImpl> => {
        const typeId = stateService.transition.params().typeId;
        if (
          typeId &&
          nodeObjectTree &&
          nodeObjectTree.entityCtx &&
          nodeObjectTree.entityCtx.actions &&
          nodeObjectTree.entityCtx.actions.creations &&
          -1 <
            indexOf(
              Object.keys(nodeObjectTree.entityCtx.actions.creations),
              typeId
            )
        ) {
          return typeId;
        } else {
          throw new Error('creation impossible');
        }
      },
    },
  ],
};

const adminOwnerNodeMoveState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_NODE_MOVE_ROUTE_NAME),
  name: ADMIN_OWNER_NODE_MOVE_ROUTE_NAME,
  url: '/move',
  component: AdminNodeMoveComponent,
};
const adminOwnerNodeActionState: Ng2StateDeclaration = {
  parent: getParentStateName(ADMIN_OWNER_NODE_ACTION_ROUTE_NAME),
  name: ADMIN_OWNER_NODE_ACTION_ROUTE_NAME,
  url: '/action/:methodId',
  component: AdminNodeActionComponent,
  resolve: [
    SHOULD_BE_LOGIN_RESOLVE,
    {
      token: OBJECT_NODE_METHOD_TOKEN,
      deps: [StateService, OBJECT_NODE_TOKEN],
      resolveFn: async (
        stateService: StateService,
        nodeObjectTree: ObjectTreeImpl
      ): Promise<IEntityMethod> => {
        await nodeObjectTree.treeNode.waitForReady();
        const methodId = stateService.transition.params().methodId;
        if (
          methodId &&
          nodeObjectTree &&
          nodeObjectTree.entityCtx &&
          nodeObjectTree.entityCtx.actions &&
          nodeObjectTree.entityCtx.actions.creations &&
          -1 <
            indexOf(
              map(
                nodeObjectTree.treeNode?.entityCtx?.actions?.methods,
                (method: IEntityMethod) => method.methodId
              ),
              methodId
            )
        ) {
          return nodeObjectTree.treeNode.entityCtx.actions.methods.find(
            (method: IEntityMethod) => methodId === method.methodId
          );
        } else {
          throw new Error('creation impossible');
        }
      },
    },
  ],
};

const adminNamespaceState = {
  parent: getParentStateName(ADMIN_NAMESPACE_ROUTE_NAME),
  name: ADMIN_NAMESPACE_ROUTE_NAME,
  url: '/namespace/:namespaceType/:namespaceName',
  component: UIView,
  abstract: true,
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

const adminNamespaceEntryState: Ng2StateDeclaration = merge(
  {},
  adminOwnerEntryState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_ENTRY_ROUTE_NAME),
    name: ADMIN_NAMESPACE_ENTRY_ROUTE_NAME,
  }
);

const adminNamespaceWelcomeState: Ng2StateDeclaration = merge(
  {},
  adminOwnerWelcomeState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_WELCOME_ROUTE_NAME),
    name: ADMIN_NAMESPACE_WELCOME_ROUTE_NAME,
  }
);
const adminNamespaceNodeState: Ng2StateDeclaration = merge(
  {},
  adminOwnerNodeState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_ROUTE_NAME,
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
        resolveFn: adminOwnerNodeState.resolve[1].resolveFn,
      },
    ],
  }
);

const adminNamespaceNodeViewState: Ng2StateDeclaration = merge(
  {},
  adminOwnerNodeViewState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME,
  }
);

const adminNamespaceNodeListState: Ng2StateDeclaration = merge(
  {},
  adminOwnerNodeListState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_LIST_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_LIST_ROUTE_NAME,
  }
);

const adminNamespaceNodeCreateState: Ng2StateDeclaration = merge(
  {},
  adminOwnerNodeCreateState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_CREATE_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_CREATE_ROUTE_NAME,
  }
);

const adminNamespaceNodeCreateTypeState: Ng2StateDeclaration = merge(
  {},
  adminOwnerNodeCreateTypeState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_CREATE_TYPE_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_CREATE_TYPE_ROUTE_NAME,
  }
);

const adminNamespaceNodeMoveState: Ng2StateDeclaration = merge(
  {},
  adminOwnerNodeMoveState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_MOVE_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_MOVE_ROUTE_NAME,
  }
);
const adminNamespaceNodeActionState: Ng2StateDeclaration = merge(
  {},
  adminOwnerNodeActionState,
  {
    parent: getParentStateName(ADMIN_NAMESPACE_NODE_ACTION_ROUTE_NAME),
    name: ADMIN_NAMESPACE_NODE_ACTION_ROUTE_NAME,
  }
);

export const ADMIN_STATES = [
  adminState,
  adminOwnerState,
  adminOwnerEntryState,
  adminOwnerNodeState,
  adminOwnerWelcomeState,
  adminOwnerNodeViewState,
  adminOwnerNodeListState,
  adminOwnerNodeCreateState,
  adminOwnerNodeCreateTypeState,
  adminOwnerNodeMoveState,
  adminOwnerNodeActionState,
  adminNamespaceState,
  adminNamespaceEntryState,
  adminNamespaceNodeState,
  adminNamespaceWelcomeState,
  adminNamespaceNodeViewState,
  adminNamespaceNodeListState,
  adminNamespaceNodeCreateState,
  adminNamespaceNodeCreateTypeState,
  adminNamespaceNodeMoveState,
  adminNamespaceNodeActionState,
];
