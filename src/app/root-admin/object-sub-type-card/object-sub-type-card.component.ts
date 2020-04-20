import { Component, OnInit, Input } from '@angular/core';
import { ObjectTypeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { IObjectSubType } from '@jacquesparis/objects-model';

const OBJECT_SUB_TYPE_SCHEMA = {
  properties: {
    name: {
      type: 'string',
      description: 'Name of the relation to the sub-object',
      readOnly: true,
    },
    subObjectTypeId: {
      type: 'string',
      widget: 'select',
      description: 'Type of sub-object',
      oneOf: [],
      buttons: [
        {
          id: 'reset',
          label: 'Reset',
        },
      ],
      readOnly: true,
    },
    min: {
      type: 'number',
      description: 'Minimum number of child',
      readOnly: true,
    },
    max: {
      type: 'number',
      description: 'Maximum number of child',
      readOnly: true,
    },
  },
  buttons: [
    {
      id: 'alert', // the id of the action callback
      label: 'Alert !', // the text inside the button
    },
  ],
};

@Component({
  selector: 'app-object-sub-type-card',
  templateUrl: './object-sub-type-card.component.html',
  styleUrls: ['./object-sub-type-card.component.sass'],
})
export class ObjectSubTypeCardComponent extends CommonComponentComponent {
  @Input() objectType: ObjectTypeImpl;
  @Input() subType: IObjectSubType;
  public mySchema = OBJECT_SUB_TYPE_SCHEMA;
  // Declare a mapping between action ids and their event listener
  public myActions = {
    alert: (property) => {
      window.alert(JSON.stringify(property.value));
    },
    reset: (property) => {
      property.reset();
    },
  };

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super();
    this.objectTypes.forEach((objectType) => {
      this.mySchema.properties.subObjectTypeId.oneOf.push({
        enum: [objectType.id],
        description: objectType.name + ' - ' + objectType.type,
      });
    });
  }

  get objectTypes(): ObjectTypeImpl[] {
    return this.objectsCommonService.objectTypesArray;
  }

  get brothers(): IObjectSubType[] {
    return this.objectType.objectSubTypes.filter(
      (oneBrother) => oneBrother.id !== this.subType.id
    );
  }

  onChange() {
    console.log(this.subType);
  }
}
