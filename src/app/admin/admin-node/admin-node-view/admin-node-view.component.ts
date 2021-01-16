import { VIEW_ROUTE_NAME } from './../../../view/view.const';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import { OBJECT_TREE_TOKEN, OBJECT_NODE_TOKEN } from './../../admin.const';
import {
  ObjectNodeImpl,
  ObjectTreeImpl,
  EntityName,
} from '@jacquesparis/objects-client';
import {
  IObjectNode,
  IObjectType,
  IObjectSubType,
} from '@jacquesparis/objects-model';
import {
  Component,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
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

  public entity: ObjectNodeImpl;

  public treeType: IObjectType;
  public subTypes: IObjectSubType[] = [];
  hasWebSite: boolean = false;

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
      if (!this.objectTree.ready) {
        await this.objectTree.waitForReady();
      }
      if (!this.entity.isReady) {
        await this.entity.waitForReady();
      }
      this.treeType = this.objectTree.treeNode.objectType;
      this.title =
        this.entity.name + ' (' + this.objectTree.treeNode.objectTypeId + ')';
      let objectChildTypes = [];
      if (
        this.objectTree.entityCtx &&
        this.objectTree.entityCtx.actions &&
        this.objectTree.entityCtx.actions.reads
      ) {
        objectChildTypes = this.objectTree.entityCtx.actions.reads;
      }
      if (this.entity.objectType) {
        this.subTypes = this.entity.objectType.objectSubTypes.filter(
          (subType) => -1 < objectChildTypes.indexOf(subType.subObjectTypeId)
        );
      }

      await super.ngOnInit();
      if (this.entity.webSiteObjectTreeUri && this.objectTree.aliasUri) {
        this.hasWebSite = true;
      }
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
}
