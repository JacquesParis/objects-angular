import { merge } from 'lodash-es';
import { VIEW_ROUTE_NAME } from './../../../view/view.const';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  OBJECT_TREE_TOKEN,
  OBJECT_NODE_TOKEN,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
} from './../../admin.const';
import {
  ObjectNodeImpl,
  ObjectTreeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import { IObjectNode } from '@jacquesparis/objects-model';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Inject,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { AbstractRestEntityComponent } from 'src/app/objects-client/abstract-rest-entity/abstract-rest-entity.component';

@Component({
  selector: 'app-admin-node-view',
  templateUrl: './admin-node-view.component.html',
  styleUrls: ['./admin-node-view.component.scss'],
})
export class AdminNodeViewComponent
  extends AbstractRestEntityComponent<IObjectNode, ObjectNodeImpl>
  implements OnInit, OnDestroy, OnChanges {
  public title: string;
  public nodeViewStateName = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;

  public entity: ObjectNodeImpl;

  constructor(
    @Inject(OBJECT_TREE_TOKEN) public mainTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_TOKEN) public objectTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService,
    protected restEntityListService: RestEntityListService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(EntityName.objectNode, objectsCommonService, restEntityListService);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    super.ngOnChanges(changes);
  }

  async ngOnInit() {
    if (this.objectTree) {
      this.entity = this.objectTree.treeNode;

      await this.objectTree.waitForReady();

      await this.entity.waitForReady();

      this.title =
        this.entity.name + ' (' + this.objectTree.treeNode.objectTypeId + ')';

      await super.ngOnInit();

      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  public refresh() {
    this.objectsCommonService.getTreeByUri(this.objectTree.uri);
  }

  public openWebSite() {
    this.stateService.go(VIEW_ROUTE_NAME, {
      siteTree: this.objectTree,
      siteId: this.objectTree.id,
    });
  }

  public async deleteValue(): Promise<void> {
    const parentId = this.entity.parentNodeId;
    super.deleteValue();
    this.stateService.go(
      this.nodeViewStateName,
      merge({}, this.stateService.params, { treeId: parentId })
    );
    return;
  }
}
