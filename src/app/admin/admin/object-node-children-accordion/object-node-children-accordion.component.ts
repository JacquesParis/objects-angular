import { ObjectsCommonService } from './../../../objects-client/services/objects-common.service';
import { AbstractRestEntityListComponent } from './../../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';
import { RestEntityListService } from './../../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import {
  EntityName,
  ObjectNodeImpl,
  ObjectSubTypeImpl,
  ObjectTreeImpl,
  ObjectTypeImpl,
} from '@jacquesparis/objects-client';
import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-object-node-children-accordion',
  templateUrl: './object-node-children-accordion.component.html',
  styleUrls: ['./object-node-children-accordion.component.scss'],
})
export class ObjectNodeChildrenAccordionComponent
  extends AbstractRestEntityListComponent<ObjectNodeImpl>
  implements OnInit, OnDestroy {
  @Input() objectTree: ObjectTreeImpl;
  @Input() objectSubType: ObjectSubTypeImpl;
  public objectType: ObjectTypeImpl;
  public children: ObjectTreeImpl[];
  public objectNode: ObjectNodeImpl;
  private changeSubscriber: () => void;
  creationAvailable: boolean = false;
  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService,
    protected restEntityListService: RestEntityListService
  ) {
    super(
      objectsCommonService,
      editableFormService,
      restEntityListService,
      EntityName.objectNode,
      EntityName.objectNode,
      EntityName.objectType
    );
  }
  public newTree: ObjectTreeImpl;

  public ngOnInit() {
    super.ngOnInit();
    this.objectType = this.getObjectTypeById(
      this.objectSubType.subObjectTypeId
    );
    this.objectNode = this.objectTree.treeNode;
    this.creationAvailable =
      !!this.objectNode.entityCtx?.actions?.creations &&
      !!this.objectNode.entityCtx?.actions?.creations[this.objectType.id];
    this.changeSubscriber = this.objectTree.onChange((): void => {
      this.changedValue();
    });
    this.changedValue();
  }

  private changedValue() {
    if (
      this.objectTree.treeNode &&
      this.objectsCommonService.getObjectNodeById(
        this.objectTree.treeNode.id
      ) &&
      this.objectType
    ) {
      this.children = this.objectTree.childrenByType(this.objectType.id);
    }
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    if (this.changeSubscriber) {
      this.changeSubscriber();
    }
  }

  public createNewEntity() {
    super.createNewEntity();
    this.newTree = this.objectsCommonService.newEntity<ObjectTreeImpl>(
      EntityName.objectTree,
      {
        parentEntity: this.objectTree,
        entityType: this.objectType,
        entityDefinition: this.objectNode.entityCtx?.actions?.creations[
          this.objectType.id
        ],
      }
    );
  }
}
