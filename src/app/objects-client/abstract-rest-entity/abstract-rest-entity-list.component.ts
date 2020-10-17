import { OnInit } from '@angular/core';
import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { RestEntityImpl } from '@jacquesparis/objects-client/lib/rest/rest-entity.impl';
import { ObjectsCommonService } from '../services/objects-common.service';
import { EntityName } from '@jacquesparis/objects-client';
export class AbstractRestEntityListComponent<
  T extends RestEntityImpl<T>
> extends CommonComponentComponent {
  public newEntity: T;
  public inCreation = false;

  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService,
    protected entityName: EntityName,
    protected parentEntityName?: EntityName,
    protected entityTypeName?: EntityName
  ) {
    super();
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
}
