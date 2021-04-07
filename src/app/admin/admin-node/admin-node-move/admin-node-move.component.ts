import { SpinnerService } from './../../../common-app/services/spinner.service';
import { indexOf, merge } from 'lodash-es';
import { BsModalService } from 'ngx-bootstrap/modal';
import { StateService } from '@uirouter/angular';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  OBJECT_TREE_TOKEN,
  OBJECT_NODE_TOKEN,
  ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME,
  ADMIN_NAMESPACE_ROUTE_NAME,
} from './../../admin.const';
import {
  ObjectNodeImpl,
  ObjectTreeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import { AbstractRestEntityListComponent } from './../../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-admin-node-move',
  templateUrl: './admin-node-move.component.html',
  styleUrls: ['./admin-node-move.component.scss'],
})
export class AdminNodeMoveComponent
  extends AbstractRestEntityListComponent<ObjectNodeImpl>
  implements OnInit {
  public nodeViewStateName: string = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;
  private excludeIds: string[] = [];
  public defaultAction: (
    tree: ObjectTreeImpl
  ) => void = this._defaultAction.bind(this);

  constructor(
    @Inject(OBJECT_TREE_TOKEN) public mainTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_TOKEN) public objectTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService,
    protected restEntityListService: RestEntityListService,
    protected stateService: StateService,
    protected spinnerService: SpinnerService
  ) {
    super(
      objectsCommonService,
      editableFormService,
      restEntityListService,
      EntityName.objectNode,
      EntityName.objectNode,
      EntityName.objectType
    );
    if (this.stateService.current.name.startsWith(ADMIN_NAMESPACE_ROUTE_NAME)) {
      this.nodeViewStateName = ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME;
    }
    this.excludeIds.push(this.objectTree.treeNode.id);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private _defaultAction(tree: ObjectTreeImpl) {}

  public mayMoveIn(tree: ObjectTreeImpl) {
    if (-1 < indexOf(this.excludeIds, tree.treeNode.id)) {
      for (const child of tree.children) {
        this.excludeIds.push(child.treeNode.id);
      }
      return false;
    }
    return (
      tree.treeNode.id !== this.objectTree.treeNode.parentNodeId &&
      tree.entityCtx?.actions?.creations &&
      this.objectTree.treeNode.objectTypeId in
        tree.entityCtx?.actions?.creations
    );
  }

  public async moveTo(tree: ObjectTreeImpl, event: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    try {
      this.spinnerService.initSteps('moveToAction', 4);
      await this.objectTree.runAction('moveTo', {
        targetId: tree.treeNode.id,
        targetUri: tree.uri,
      });
      this.spinnerService.endAction('moveToAction');
      await this.objectsCommonService.getTreeById(
        this.objectTree.treeNode.parentNodeId
      );
      this.spinnerService.endAction('moveToAction');
      await this.objectsCommonService.getTreeById(tree.treeNode.id);
      this.spinnerService.endAction('moveToAction');
      await this.objectsCommonService.getNodeByUri(
        this.objectTree.treeNode.uri
      );
      this.spinnerService.endAction('moveToAction');
    } catch (error) {
    } finally {
      this.spinnerService.endSteps('moveToAction');
    }

    this.stateService.go(
      this.nodeViewStateName,
      merge({}, this.stateService.params, {
        treeId: this.objectTree.treeNode.id,
      })
    );
  }
}
