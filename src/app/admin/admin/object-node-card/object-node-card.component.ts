import { Subscription } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { VIEW_ROUTE_NAME } from './../../../view/view.const';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  ObjectNodeImpl,
  EntityName,
  ObjectTypeImpl,
  ObjectTreeImpl,
} from '@jacquesparis/objects-client';
import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { AbstractRestEntityComponent } from '../../../objects-client/abstract-rest-entity/abstract-rest-entity.component';
import {
  IObjectNode,
  IObjectType,
  IObjectSubType,
} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';
import { OnChanges } from '@angular/core';

@Component({
  selector: 'app-object-node-card',
  templateUrl: './object-node-card.component.html',
  styleUrls: ['./object-node-card.component.scss'],
})
export class ObjectNodeCardComponent
  extends AbstractRestEntityComponent<IObjectNode, ObjectNodeImpl>
  implements OnInit, OnDestroy, OnChanges {
  @Input() objectTree: ObjectTreeImpl;
  @Input() hideNode = false;
  @Input() hideChildren = false;
  @ViewChildren(TabsetComponent) tabSet!: QueryList<TabsetComponent>;

  public title: string;

  public entity: ObjectNodeImpl;

  public treeType: IObjectType;
  public subTypes: IObjectSubType[] = [];
  hasWebSite: boolean = false;

  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService,
    protected restEntityListService: RestEntityListService
  ) {
    super(EntityName.objectNode, objectsCommonService, restEntityListService);
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    super.ngOnChanges(changes);
    this.selectTab();
  }

  async ngOnInit() {
    this.entity = this.objectTree.treeNode;
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
    this.registerSubscription(
      this.restEntityListService.subscribe(EntityName.objectNode, () => {
        this.selectTab();
      })
    );
  }

  selectTab() {
    if (this.tabSet && this.tabSet.first) {
      if (
        _.some(this.objectTree.children, (child) =>
          this.restEntityListService.isOpen(
            EntityName.objectNode,
            child.treeNode
          )
        )
      ) {
        if (!this.tabSet.first.tabs[1].active) {
          this.tabSet.first.tabs[1].active = true;
        }
      } else {
        if (!this.tabSet.first.tabs[0].active) {
          this.tabSet.first.tabs[0].active = true;
        }
      }
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
