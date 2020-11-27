import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss'],
})
export class UserRegistrationComponent implements OnInit {
  public data = {
    name: 'John Doe',
    vegetarian: false,
    birthDate: '1985-06-02',
    personalData: {
      age: 34,
    },
    postalCode: '12345',
  };

  public s = {
    type: 'object',
    properties: {
      comments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
            },
            message: {
              type: 'string',
              maxLength: 5,
            },
            enum: {
              type: 'string',
              const: 'foo',
            },
          },
        },
      },
    },
  };
  public ui = {
    type: 'ListWithDetail',
    scope: '#/properties/comments',
    options: {
      detail: {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/date',
          },
          {
            type: 'Control',
            scope: '#/properties/message',
          },
        ],
      },
    },
  };
  public d = {
    comments: [
      {
        date: '2001-09-10',
        message: 'This is an example message',
      },
      {
        date: '2020-11-25',
        message: 'Get ready for booohay',
      },
    ],
  };

  public _schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        readonly: true,
        description: 'Please enter your name',
      },
      vegetarian: {
        type: 'boolean',
      },
      file: {
        type: 'file',
      },
      birthDate: {
        type: 'string',
        format: 'date',
      },
      nationality: {
        type: 'string',
        enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
      },
      personalData: {
        type: 'object',
        properties: {
          age: {
            type: 'integer',
            description: 'Please enter your age.',
          },
          height: {
            type: 'number',
          },
          drivingSkill: {
            type: 'number',
            maximum: 10,
            minimum: 1,
            default: 7,
          },
        },
        required: ['age', 'height'],
      },
      occupation: {
        type: 'string',
      },
      postalCode: {
        type: 'string',
        maxLength: 5,
      },
    },
    required: ['occupation', 'nationality'],
  };
  public get schema() {
    const result = _.cloneDeep(this._schema);
    for (const key in result.properties) {
      if ('file' === result.properties[key].type) {
        result.properties[key].type = 'object';
      }
    }
    return result;
  }
  uischema = {
    type: 'VerticalLayout',
    elements: _.map(Object.keys(this._schema.properties), (key) => {
      const result: any = {
        type: 'Control',
        scope: '#/properties/' + key,
        options: {
          readonly: true,
        },
      };
      if ('file' === this._schema.properties[key].type) {
        result.options.file = true;
      }
      if ('array' === this._schema.properties[key].type) {
        result.options.detail = {
          type: this._schema.properties[key].items.type,
        };
      }
      return result;
    }),
  };
  test = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/name',
          },
          {
            type: 'Control',
            scope: '#/properties/personalData/properties/age',
          },
          {
            type: 'Control',
            scope: '#/properties/birthDate',
          },
        ],
      },
      {
        type: 'Label',
        text: 'Additional Information',
      },
      {
        type: 'HorizontalLayout',
        elements: [
          {
            type: 'Control',
            scope: '#/properties/personalData/properties/height',
          },
          {
            type: 'Control',
            scope: '#/properties/nationality',
          },
          {
            type: 'Control',
            scope: '#/properties/occupation',
            suggestion: [
              'Accountant',
              'Engineer',
              'Freelancer',
              'Journalism',
              'Physician',
              'Student',
              'Teacher',
              'Other',
            ],
          },
        ],
      },
    ],
  };
  constructor() {}

  ngOnInit() {}
}
