import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  ObjectNodeImpl,
  EntityName,
  ObjectTypeImpl,
  ObjectTreeImpl,
} from '@jacquesparis/objects-client';
import { Component, Input } from '@angular/core';
import { AbstractRestEntityComponent } from '../../../objects-client/abstract-rest-entity/abstract-rest-entity.component';
import {
  IObjectNode,
  IObjectType,
  IObjectSubType,
} from '@jacquesparis/objects-model';

@Component({
  selector: 'app-object-node-card',
  templateUrl: './object-node-card.component.html',
  styleUrls: ['./object-node-card.component.scss'],
})
export class ObjectNodeCardComponent extends AbstractRestEntityComponent<
  IObjectNode,
  ObjectNodeImpl
> {
  @Input() objectTree: ObjectTreeImpl;
  @Input() hideNode = false;
  @Input() hideChildren = false;

  public title: string;

  public entity: ObjectNodeImpl;

  public treeType: IObjectType;
  public subTypes: IObjectSubType[] = [];

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(EntityName.objectNode, objectsCommonService);
  }

  async ngOnInit() {
    this.entity = this.objectTree.treeNode;
    this.treeType = this.objectTree.treeNode.objectType;
    this.title = this.entity.name + ' (' + this.treeType.name + ')';
    let objectChildTypes = [];
    if (
      this.objectTree.entityCtx &&
      this.objectTree.entityCtx.actions &&
      this.objectTree.entityCtx.actions.reads
    ) {
      objectChildTypes = this.objectTree.entityCtx.actions.reads;
    }
    this.subTypes = this.entity.objectType.objectSubTypes.filter(
      (subType) => -1 < objectChildTypes.indexOf(subType.subObjectTypeId)
    );
    await super.ngOnInit();
  }
}
