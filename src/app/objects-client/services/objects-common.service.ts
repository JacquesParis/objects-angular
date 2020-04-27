import { Injectable } from '@angular/core';
import {
  ObjectTypesService,
  ObjectTypeImpl,
  EntityName,
  IJsonSchema,
  ObjectSubTypesService,
} from '@jacquesparis/objects-client';
import { ConfigurationService } from '../../common-app/services/configuration.service';
import { NotInitialized } from '../../common-app/errors/not-initialized.error';
import { HttpRestService } from '../../common-app/services/http-rest.service';
import { IRestEntity, IObjectSubType } from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';
import { ObjectSubTypeImpl } from '@jacquesparis/objects-client';

@Injectable({
  providedIn: 'root',
})
export class ObjectsCommonService {
  private _objectTypes: ObjectTypeImpl[];
  private _objectTypesByName: { [uri: string]: ObjectTypeImpl } = {};
  private _objectTypesByUri: { [uri: string]: ObjectTypeImpl } = {};
  private _objectTypesById: { [id: string]: ObjectTypeImpl } = {};
  private entitySchema: Partial<
    { [entityType in EntityName]: IJsonSchema }
  > = {};
  private objectsTypeService: ObjectTypesService;
  private objectsSubTypeService: ObjectSubTypesService;
  constructor(
    protected configurationService: ConfigurationService,
    protected httpRestService: HttpRestService
  ) {
    this.objectsTypeService = ObjectTypesService.getService(
      this.httpRestService,
      this.configurationService.getServer()
    );
    this.entitySchema[
      this.objectsTypeService.entityName
    ] = this.objectsTypeService.entityDefinition;
    this.objectsSubTypeService = ObjectSubTypesService.getService(
      this.httpRestService,
      this.configurationService.getServer()
    );
    this.entitySchema[
      this.objectsSubTypeService.entityName
    ] = this.objectsSubTypeService.entityDefinition;
  }

  public async init(): Promise<void> {
    this._objectTypes = await this.objectsTypeService.getAll();
    this._objectTypes.forEach((objectType) => {
      this._objectTypesByName[objectType.name] = objectType;
      this._objectTypesByUri[objectType.uri] = objectType;
      this._objectTypesById[objectType.id] = objectType;
    });

    this._objectTypes.forEach((objectType) => {
      if (!objectType.objectSubTypes) {
        objectType.objectSubTypes = [];
      }
      objectType.objectSubTypes.forEach((subType: ObjectSubTypeImpl) => {
        subType.objectType = this._objectTypesById[subType.subObjectTypeId];
      });
    });

    return;
  }

  get objectTypes(): { [type: string]: ObjectTypeImpl } {
    if (!this._objectTypes) {
      throw new NotInitialized(this);
    }
    return this._objectTypesByName;
  }
  get objectTypesArray(): ObjectTypeImpl[] {
    if (!this._objectTypes) {
      throw new NotInitialized(this);
    }
    return this._objectTypes;
  }

  public getObjectType(id): ObjectTypeImpl {
    return this._objectTypesById[id];
  }

  get rootType(): ObjectTypeImpl {
    return this.configurationService.getRootObjectTypeName() in
      this._objectTypesByName
      ? this._objectTypesByName[
          this.configurationService.getRootObjectTypeName()
        ]
      : this._objectTypes[0];
  }

  public getSchema(entityName: EntityName) {
    return this.entitySchema[entityName];
    /*
    switch (entityName) {
      case EntityName.objectSubType:
        /*
        result = _.cloneDeep(result);
        result.properties.subObjectTypeId.oneOf = [];
        this._objectTypes.forEach((availableObjectType) => {
          result.properties.subObjectTypeId.oneOf.push({
            enum: [availableObjectType.id],
            title: availableObjectType.name + ' - ' + availableObjectType.type,
          });
        });
        const objectSubType: IObjectSubType = entity as IObjectSubType;
        const objectType = this._objectTypesById[objectSubType.objectTypeId];
        const brothers = objectType.objectSubTypes.filter(
          (oneBrother) => oneBrother.id !== objectSubType.id
        );
        if (0 === brothers.length) {
        delete result.properties.exclusions;
        delete result.properties
          .mandatories;
        } else {
          result.properties.exclusions.items = {
            type: 'string',
            enum: [],
            enumNames: [],
          };
          result.properties.mandatories.items = {
            type: 'string',
            enum: [],
            enumNames: [],
          };
          brothers.forEach((brother) => {
            result.properties.exclusions.items.enum.push(brother.id);
            result.properties.mandatories.items.enum.push(brother.id);
            result.properties.exclusions.items.enumNames.push(brother.name);
            result.properties.mandatories.items.enumNames.push(brother.name);
          });
        }

        break;

      default:
        break;
    }
    return result;*/
  }
}
