import { SpinnerService } from './../../common-app/services/spinner.service';
import { Injectable } from '@angular/core';
import {
  ObjectTypesService,
  ObjectTypeImpl,
  EntityName,
  ObjectSubTypesService,
  IEntityPropertiesWrapper,
  ObjectNodesService,
  ObjectNodeImpl,
  ObjectTreeImpl,
  ObjectTreesService,
  ObjectClientService,
} from '@jacquesparis/objects-client';
import { ConfigurationService } from '../../common-app/services/configuration.service';
import { NotInitialized } from '../../common-app/errors/not-initialized.error';
import { HttpRestService } from '../../common-app/services/http-rest.service';
import * as _ from 'lodash-es';
import { ObjectSubTypeImpl } from '@jacquesparis/objects-client';
import { IJsonSchema, IRestEntity } from '@jacquesparis/objects-model';
import { RestEntityImpl } from '@jacquesparis/objects-client';

@Injectable({
  providedIn: 'root',
})
export class ObjectsCommonService {
  private _objectTrees: {
    [treeType: string]: { [treeName: string]: ObjectTreeImpl };
  } = {};
  public objectClient: ObjectClientService;
  constructor(
    protected configurationService: ConfigurationService,
    protected httpRestService: HttpRestService,
    spinnerService: SpinnerService
  ) {
    this.objectClient = ObjectClientService.init(
      this.httpRestService,
      this.configurationService.getServer(),
      { actionsLoggingService: spinnerService }
    );
  }

  private get objectsTypeService(): ObjectTypesService {
    return this.objectClient.objectTypesService;
  }
  private get objectsSubTypeService(): ObjectSubTypesService {
    return this.objectClient.objectSubTypesService;
  }
  public get objectNodesService(): ObjectNodesService {
    return this.objectClient.objectNodeService;
  }
  public get objectTreesService(): ObjectTreesService {
    return this.objectClient.objectTreeService;
  }

  public async init(): Promise<void> {
    //await this.objectsTypeService.getAll();
    return;
  }

  get objectTypes(): ObjectTypeImpl[] {
    const objectTypes = this.objectsTypeService.getCachedObjects();
    if (!objectTypes) {
      throw new NotInitialized(this);
    }
    return objectTypes;
  }

  public getObjectTypeById(id): ObjectTypeImpl {
    return this.objectsTypeService.getCachedObjectById(id);
  }

  public getObjectNodeById(id): ObjectNodeImpl {
    return this.objectNodesService.getCachedObjectById(id);
  }

  public getObjectTreeById(id): ObjectTreeImpl {
    return this.objectTreesService.getCachedObjectById(id);
  }

  public getOrSearchObjectTypeById(id): Promise<ObjectTypeImpl> {
    return this.objectsTypeService.getCachedOrRemoteObjectById(id);
  }

  public getOrSearchObjectNodeById(id): Promise<ObjectNodeImpl> {
    return this.objectNodesService.getCachedOrRemoteObjectById(id);
  }

  public getOrSearchObjectTreeById(id): Promise<ObjectTreeImpl> {
    return this.objectTreesService.getCachedOrRemoteObjectById(id);
  }

  get objectTypesByName(): { [name: string]: ObjectTypeImpl } {
    return _.mapKeys(this.objectTypes, (objectType: ObjectTypeImpl, index) => {
      return objectType.name;
    });
  }

  get rootType(): ObjectTypeImpl {
    const root = this.objectTypesByName[
      this.configurationService.getRootObjectTypeName()
    ];
    return root ? root : this.objectTypes[0];
  }

  public getSchema(entityName: EntityName, entity?: IRestEntity): IJsonSchema {
    if (entity?.entityDefinition) {
      return entity.entityDefinition;
    }
    switch (entityName) {
      case EntityName.objectType:
        return this.objectsTypeService.entityDefinition;
      case EntityName.objectSubType:
        return this.objectsSubTypeService.getSchema(
          entity as ObjectSubTypeImpl,
          this.getObjectTypeById((entity as ObjectSubTypeImpl).objectTypeId),
          this.objectTypes
        );
      case EntityName.objectNode:
        return this.objectNodesService.getSchema(
          this.getObjectTypeById((entity as ObjectNodeImpl).objectTypeId)
        );
      default:
        throw new Error('Unknown schema');
    }
  }

  public newEntity<T extends RestEntityImpl<T>>(
    entityName: EntityName,
    entitySpeficities: {
      [specifity: string]: any;
      parentEntity?: IRestEntity;
      entityType?: IRestEntity;
      entityTypeId?: string;
      jsonSchema?: IJsonSchema;
    }
  ): T {
    let impl: T;
    switch (entityName) {
      case EntityName.objectType:
        return (new ObjectTypeImpl(this.objectsTypeService) as unknown) as T;
      case EntityName.objectSubType:
        return (new ObjectSubTypeImpl(this.objectsSubTypeService, {
          objectTypeId: entitySpeficities.parentEntity.id,
          objectTypeUri: entitySpeficities.parentEntity.uri,
        }) as unknown) as T;
      case EntityName.objectNode:
        if (entitySpeficities.entityType) {
          return (new ObjectNodeImpl(this.objectNodesService, {
            parentNodeId: entitySpeficities.parentEntity.id,
            parentNodeUri: entitySpeficities.parentEntity.uri,
            objectTypeId: entitySpeficities.entityType.id,
            objectTypeUri: entitySpeficities.entityType.uri,
            entityCtx: {
              jsonSchema: entitySpeficities.jsonSchema,
              entityType: EntityName.objectNode,
            },
          }) as unknown) as T;
        } else {
          return (new ObjectNodeImpl(this.objectNodesService, {
            parentNodeId: entitySpeficities.parentEntity.id,
            parentNodeUri: entitySpeficities.parentEntity.uri,
            objectTypeId: entitySpeficities.entityTypeId,
            entityCtx: {
              jsonSchema: entitySpeficities.jsonSchema,
              entityType: EntityName.objectNode,
            },
          }) as unknown) as T;
        }
      case EntityName.objectTree:
        return (new ObjectTreeImpl(this.objectTreesService, {
          treeNode: this.newEntity<ObjectNodeImpl>(
            EntityName.objectNode,
            entitySpeficities
          ),
        }) as unknown) as T;
      default:
        throw new Error('Method not implemented.');
    }
  }

  public async getTreeByUri(uri: string): Promise<ObjectTreeImpl> {
    return await this.objectTreesService.get(uri);
  }
  public async getNodeByUri(uri: string): Promise<ObjectNodeImpl> {
    return await this.objectNodesService.get(uri);
  }
  public async getTreeById(id: string) {
    return await this.objectTreesService.get(
      this.objectTreesService.getUri(id)
    );
  }

  public async getTree(
    ownerType: string,
    ownerName: string,
    namespaceType: string,
    namespaceName: string,
    treeType: string,
    treeName: string
  ): Promise<ObjectTreeImpl> {
    const ownerTreeType =
      ownerType +
      '$$' +
      ownerName +
      '$$' +
      namespaceType +
      '$$' +
      namespaceName +
      '$$' +
      treeType;
    if (!(ownerTreeType in this._objectTrees)) {
      this._objectTrees[ownerTreeType] = {};
    }
    if (!(treeName in this._objectTrees[ownerTreeType])) {
      this._objectTrees[ownerTreeType][
        treeName
      ] = await this.objectTreesService.getRootTree(
        ownerType,
        ownerName,
        namespaceType,
        namespaceName,
        treeType,
        treeName
      );
    }
    return this._objectTrees[ownerTreeType][treeName];
  }

  public async getNamespaceTree(
    ownerType: string,
    ownerName: string,
    namespaceType: string,
    namespaceName: string
  ): Promise<ObjectTreeImpl> {
    const ownerTreeType = ownerType + '$$' + ownerName + '$$' + namespaceType;
    if (!(ownerTreeType in this._objectTrees)) {
      this._objectTrees[ownerTreeType] = {};
    }
    if (!(namespaceName in this._objectTrees[ownerTreeType])) {
      this._objectTrees[ownerTreeType][
        namespaceName
      ] = await this.objectTreesService.getRootTree(
        ownerType,
        ownerName,
        namespaceType,
        namespaceName
      );
    }
    return this._objectTrees[ownerTreeType][namespaceName];
  }

  public async getOwnerTree(
    ownerType: string,
    ownerName: string
  ): Promise<ObjectTreeImpl> {
    if (!(ownerType in this._objectTrees)) {
      this._objectTrees[ownerType] = {};
    }
    if (!(ownerName in this._objectTrees[ownerType])) {
      this._objectTrees[ownerType][
        ownerName
      ] = await this.objectTreesService.getRootTree(ownerType, ownerName);
    }
    return this._objectTrees[ownerType][ownerName];
  }
}
