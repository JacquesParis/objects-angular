import { Component, OnInit, Input } from '@angular/core';
import { ObjectTypeImpl } from '@jacquesparis/objects-client';
import { ObjectsCommonService } from '../../objects-client/services/objects-common.service';
import { CommonComponentComponent } from '../../common-app/common-component/common-component.component';
import { IObjectSubType } from '@jacquesparis/objects-model';

const OBJECT_SUB_TYPE_SCHEMA = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name of the relation to the sub-object',
      readonly: false,
    },

    subObjectTypeId: {
      type: 'string',
      widget: 'select',
      title: 'Type of sub-object',
      oneOf: [],
      buttons: [
        {
          id: 'reset',
          label: 'Reset',
        },
      ],
    },
    min: {
      type: 'number',
      title: 'Minimum number of child',
      minimum: 0,
    },
    max: {
      type: 'number',
      title: 'Maximum number of child',
      readonly: true,
    },
    submit: {
      type: 'submit',
      title: 'coucou',
      hidden: true,
      condition: false,
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
  styleUrls: ['./object-sub-type-card.component.scss'],
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
  myLayout: any;

  constructor(protected objectsCommonService: ObjectsCommonService) {
    super();
    this.myLayout = [
      '*',
      {
        type: 'submit',
        title: 'OK',
        htmlClass: 'd-none',
      },
    ];
    if (0 === this.mySchema.properties.subObjectTypeId.oneOf.length) {
      this.objectTypes.forEach((availableObjectType) => {
        this.mySchema.properties.subObjectTypeId.oneOf.push({
          enum: [availableObjectType.id],
          title: availableObjectType.name + ' - ' + availableObjectType.type,
        });
        /*
        this.mySchema.properties.subObjectTypeId.enum.push(objectType.id);
        this.mySchema.properties.subObjectTypeId.optionLabels.push(
          objectType.name + ' - ' + objectType.type
        );*/
      });
    }
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
