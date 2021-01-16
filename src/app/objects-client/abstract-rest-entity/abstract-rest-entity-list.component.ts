import { RestEntityListService } from './rest-entity-list.service';
import { OnInit } from '@angular/core';
import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import { CommonComponent } from '../../common-app/common-component/common-component.component';
import { RestEntityImpl } from '@jacquesparis/objects-client/lib/rest/rest-entity.impl';
import { ObjectsCommonService } from '../services/objects-common.service';
import {
  EntityName,
  ObjectNodeImpl,
  ObjectTypeImpl,
} from '@jacquesparis/objects-client';
export class AbstractRestEntityListComponent<
  T extends RestEntityImpl<T>
> extends CommonComponent {
  public newEntity: T;
  public inCreation = false;
  private objectNodesById: { [id: string]: ObjectNodeImpl } = {};
  private objectTypesById: { [id: string]: ObjectTypeImpl } = {};

  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService,
    protected restEntityListService: RestEntityListService,
    protected entityName: EntityName,
    protected parentEntityName?: EntityName,
    protected entityTypeName?: EntityName
  ) {
    super();
  }

  public getObjectNodeById(id) {
    if (!(id in this.objectNodesById)) {
      this.objectNodesById[id] = this.objectsCommonService.getObjectNodeById(
        id
      );
    }
    return this.objectNodesById[id];
  }

  public getObjectTypeById(id): ObjectTypeImpl {
    if (!(id in this.objectTypesById)) {
      this.objectTypesById[id] = this.objectsCommonService.getObjectTypeById(
        id
      );
    }
    return this.objectTypesById[id];
  }

  public createNewEntity() {
    this.newEntity = this.objectsCommonService.newEntity<T>(this.entityName, {
      parentEntity: this[this.parentEntityName],
      entityType: this[this.entityTypeName],
    });
    this.inCreation = true;
  }

  public endCreation() {
    this.inCreation = false;
  }

  get disabledAction() {
    return this.editableFormService.hasARunningEdition;
  }

  public isOpen(child: T): boolean {
    return this.restEntityListService.isOpen(this.entityName, child);
  }
  public async setOpen(child: any, value = true, parents: T[] = []) {
    for (const parent of parents) {
      this.setOpen(parent, value);
    }
    if (value && !child.isReady) {
      await child.waitForReady();
    }
    this.restEntityListService.setOpen(this.entityName, child.id, value);
  }
}
