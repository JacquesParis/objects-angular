import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import {
  ObjectNodeImpl,
  EntityName,
  ObjectTypeImpl,
  ObjectTreeImpl,
} from '@jacquesparis/objects-client';
import { Component, Input } from '@angular/core';
import { AbstractRestEntityComponent } from '../../../objects-client/abstract-rest-entity/abstract-rest-entity.component';
import { IObjectNode } from '@jacquesparis/objects-model';

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

  get title() {
    return this.entity.name + ' (' + this.treeType.name + ')';
  }

  get entity(): ObjectNodeImpl {
    return this.objectTree.treeNode;
  }

  get treeType() {
    return this.objectTree.treeNode.objectType;
  }

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super(EntityName.objectNode, objectsCommonService);
  }

  get subTypes() {
    return this.objectTree.treeNode.objectType.objectSubTypes;
  }
}
