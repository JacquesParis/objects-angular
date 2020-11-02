import { RestEntityListService } from './../../objects-client/abstract-rest-entity/rest-entity-list.service';
import { EditableFormService } from '@jacquesparis/objects-angular-forms';
import { Component, OnInit } from '@angular/core';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { ObjectTypeImpl, EntityName } from '@jacquesparis/objects-client';
import { AbstractRestEntityListComponent } from '../../objects-client/abstract-rest-entity/abstract-rest-entity-list.component';

@Component({
  selector: 'app-object-types-list',
  templateUrl: './object-types-list.component.html',
  styleUrls: ['./object-types-list.component.scss'],
})
export class ObjectTypesListComponent extends AbstractRestEntityListComponent<
  ObjectTypeImpl
> {
  constructor(
    protected objectsCommonService: ObjectsCommonService,
    protected editableFormService: EditableFormService,
    protected restEntityListService: RestEntityListService
  ) {
    super(
      objectsCommonService,
      editableFormService,
      restEntityListService,
      EntityName.objectType
    );
  }

  get objectTypes(): ObjectTypeImpl[] {
    return this.objectsCommonService.objectTypes;
  }
}
