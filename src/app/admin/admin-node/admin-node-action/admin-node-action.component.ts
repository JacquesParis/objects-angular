import { merge } from 'lodash-es';
import { DomSanitizer } from '@angular/platform-browser';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME,
  ADMIN_NAMESPACE_ROUTE_NAME,
  ADMIN_OWNER_NODE_VIEW_ROUTE_NAME,
  OBJECT_NODE_METHOD_TOKEN,
  OBJECT_NODE_TOKEN,
  OBJECT_TREE_TOKEN,
} from './../../admin.const';
import { AbstractRestEntityComponent } from 'src/app/objects-client/abstract-rest-entity/abstract-rest-entity.component';
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  Inject,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { IObjectNode, IEntityMethod } from '@jacquesparis/objects-model';
import {
  ObjectNodeImpl,
  ObjectTreeImpl,
  EntityName,
} from '@jacquesparis/objects-client';

@Component({
  selector: 'app-admin-node-action',
  templateUrl: './admin-node-action.component.html',
  styleUrls: ['./admin-node-action.component.scss'],
})
export class AdminNodeActionComponent
  extends AbstractRestEntityComponent<IObjectNode, ObjectNodeImpl>
  implements OnInit {
  public title: string;
  public nodeViewStateName = ADMIN_OWNER_NODE_VIEW_ROUTE_NAME;

  public entity: ObjectNodeImpl;

  constructor(
    @Inject(OBJECT_TREE_TOKEN) public mainTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_TOKEN) public objectTree: ObjectTreeImpl,
    @Inject(OBJECT_NODE_METHOD_TOKEN) public method: IEntityMethod,
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService,
    protected restEntityListService: RestEntityListService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected domSanitizer: DomSanitizer
  ) {
    super(EntityName.objectNode, objectsCommonService, restEntityListService);
    if (this.stateService.current.name.startsWith(ADMIN_NAMESPACE_ROUTE_NAME)) {
      this.nodeViewStateName = ADMIN_NAMESPACE_NODE_VIEW_ROUTE_NAME;
    }
  }

  async ngOnInit() {
    if (this.objectTree) {
      this.entity = this.objectTree.treeNode;

      await this.objectTree.waitForReady();

      await this.entity.waitForReady();

      await super.ngOnInit();
    }
  }

  async initEntity() {
    await super.initEntity();

    this.changeDetectorRef.detectChanges();
  }

  public async runAction(
    methodId: string,
    parameters: any,
    methodSampling?: string
  ): Promise<any> {
    const result = await super.runAction(methodId, parameters, methodSampling);

    this.stateService.go(
      this.nodeViewStateName,
      merge({}, this.stateService.params, {
        treeId: this.objectTree.treeNode.id,
      })
    );
    return result;
  }
}
