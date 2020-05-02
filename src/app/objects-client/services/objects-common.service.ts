import { Injectable } from '@angular/core';
import {
  ObjectTypesService,
  ObjectTypeImpl,
  EntityName,
  IJsonSchema,
  ObjectSubTypesService,
  IEntityPropertiesWrapper,
} from '@jacquesparis/objects-client';
import { ConfigurationService } from '../../common-app/services/configuration.service';
import { NotInitialized } from '../../common-app/errors/not-initialized.error';
import { HttpRestService } from '../../common-app/services/http-rest.service';
import * as _ from 'lodash-es';
import { ObjectSubTypeImpl } from '@jacquesparis/objects-client';
import { IRestEntity } from '@jacquesparis/objects-model';

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
  }

  public newObjectType(): ObjectTypeImpl {
    return new ObjectTypeImpl(this.objectsTypeService);
  }

  public registerNewlyCreatedEntity(
    entityTypeName: EntityName,
    entity: IEntityPropertiesWrapper<IRestEntity>
  ) {
    switch (entityTypeName) {
      case EntityName.objectType:
        const objectType: ObjectTypeImpl = entity as ObjectTypeImpl;
        let index = 0;
        while (
          index < this._objectTypes.length &&
          this._objectTypes[index].name < objectType.name
        ) {
          index++;
        }
        if (index === this._objectTypes.length) {
          this._objectTypes.push(objectType);
        } else {
          this._objectTypes.splice(index, 0, objectType);
        }
        this._objectTypesByName[objectType.name] = this._objectTypes[index];
        this._objectTypesById[objectType.id] = this._objectTypes[index];
        this._objectTypesByUri[objectType.uri] = this._objectTypes[index];
        break;

      default:
        throw new Error('Method not implemented.');
        break;
    }
  }
  public unRegisterEntity(
    entityTypeName: EntityName,
    entity: IEntityPropertiesWrapper<IRestEntity>
  ) {
    switch (entityTypeName) {
      case EntityName.objectType:
        const objectType: ObjectTypeImpl = entity as ObjectTypeImpl;
        let index = 0;
        while (
          index < this._objectTypes.length &&
          this._objectTypes[index].id !== objectType.id
        ) {
          index++;
        }
        if (index < this._objectTypes.length) {
          this._objectTypes.splice(index, 1);
          delete this._objectTypesByName[objectType.name];
          delete this._objectTypesById[objectType.id];
          delete this._objectTypesByUri[objectType.uri];
        }
        break;
      default:
        throw new Error('Method not implemented.');
        break;
    }
  }
}
