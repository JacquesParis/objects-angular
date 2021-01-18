import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  ADMIN_OWNER_NODE_LIST_ROUTE_NAME,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  OBJECT_NODE_TOKEN,
  OBJECT_NODE_TYPE_TOKEN,
  OBJECT_TREE_TOKEN,
} from './../../admin.const';
import {
  ObjectNodeImpl,
  ObjectTreeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import { IObjectNode, IJsonSchema } from '@jacquesparis/objects-model';
import { AbstractRestEntityComponent } from 'src/app/objects-client/abstract-rest-entity/abstract-rest-entity.component';
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { merge } from 'lodash-es';

@Component({
  selector: 'app-admin-node-create',
  templateUrl: './admin-node-create.component.html',
  styleUrls: ['./admin-node-create.component.scss'],
})
export class AdminNodeCreateComponent
  extends AbstractRestEntityComponent<IObjectNode, ObjectNodeImpl>
  implements OnInit {
  public parentEntity: ObjectNodeImpl;
  public typeSchema: IJsonSchema;
  public entity: ObjectNodeImpl;
  public isReady = false;
  public nodeViewStateName = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;
  public nodeListStateName = ADMIN_OWNER_NODE_LIST_ROUTE_NAME;

  constructor(
    @Inject(OBJECT_TREE_TOKEN) public mainTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_TOKEN) public objectTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_TYPE_TOKEN) public typeId: string,
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService,
    protected restEntityListService: RestEntityListService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(EntityName.objectNode, objectsCommonService, restEntityListService);
  }

  async ngOnInit() {
    if (this.objectTree) {
      this.parentEntity = this.objectTree.treeNode;

      await this.objectTree.waitForReady();
      await this.parentEntity.waitForReady();

      this.typeSchema = this.objectTree.entityCtx.actions.creations[
        this.typeId
      ];

      this.entity = this.objectsCommonService.newEntity<ObjectNodeImpl>(
        EntityName.objectNode,
        {
          parentEntity: this.parentEntity,
          entityTypeId: this.typeId,
          jsonSchema: this.typeSchema,
        }
      );

      await super.ngOnInit();
    }
  }

  public async saveValue(value: Partial<ObjectNodeImpl>): Promise<void> {
    await super.saveValue(value);
    this.stateService.go(
      this.nodeViewStateName,
      merge({}, this.stateService.params, { treeId: this.entity.id })
    );
  }

  public cancelAction() {
    super.cancelAction();
    this.stateService.go(
      this.nodeViewStateName,
      this.stateService.params // merge({}, this.stateService.params, {})
    );
  }
}
