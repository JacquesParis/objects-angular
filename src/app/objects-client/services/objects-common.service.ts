import { ObjectTree } from './../models/object-tree';
import { element } from 'protractor';
import { Injectable } from '@angular/core';
import {
  ObjectTypesService,
  ObjectTypeImpl,
  EntityName,
  IJsonSchema,
  ObjectSubTypesService,
  IEntityPropertiesWrapper,
  ObjectNodesService,
  ObjectNodeImpl,
} from '@jacquesparis/objects-client';
import { ConfigurationService } from '../../common-app/services/configuration.service';
import { NotInitialized } from '../../common-app/errors/not-initialized.error';
import { HttpRestService } from '../../common-app/services/http-rest.service';
import * as _ from 'lodash-es';
import { ObjectSubTypeImpl } from '@jacquesparis/objects-client';
import { IRestEntity } from '@jacquesparis/objects-model';
import { RestEntityImpl } from '@jacquesparis/objects-client/lib/rest/rest-entity.impl';

@Injectable({
  providedIn: 'root',
})
export class ObjectsCommonService {
  private _objectTypes: ObjectTypeImpl[];
  private _objectTypesByName: { [uri: string]: ObjectTypeImpl } = {};
  private _objectTypesByUri: { [uri: string]: ObjectTypeImpl } = {};
  private _objectTypesById: { [id: string]: ObjectTypeImpl } = {};
  private _objectTreeNodesById: { [id: string]: ObjectTree } = {};

  private objectsTypeService: ObjectTypesService;
  private objectsSubTypeService: ObjectSubTypesService;
  private objectNodesService: ObjectNodesService;
  private _objectTrees: {
    [treeType: string]: { [treeName: string]: ObjectTree };
  } = {};
  constructor(
    protected configurationService: ConfigurationService,
    protected httpRestService: HttpRestService
  ) {
    this.objectsTypeService = ObjectTypesService.getService(
      this.httpRestService,
      this.configurationService.getServer()
    );
    this.objectsSubTypeService = ObjectSubTypesService.getService(
      this.httpRestService,
      this.configurationService.getServer()
    );
    this.objectNodesService = ObjectNodesService.getService(
      this.httpRestService,
      this.configurationService.getServer()
    );
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

  public getObjectNode(id): ObjectNodeImpl {
    return this._objectTreeNodesById[id]
      ? this._objectTreeNodesById[id].treeNode
      : null;
  }

  public getObjectTree(id): ObjectTree {
    return this._objectTreeNodesById[id];
  }

  get rootType(): ObjectTypeImpl {
    return this.configurationService.getRootObjectTypeName() in
      this._objectTypesByName
      ? this._objectTypesByName[
          this.configurationService.getRootObjectTypeName()
        ]
      : this._objectTypes[0];
  }

  public getSchema(entityName: EntityName, entity?: IRestEntity) {
    switch (entityName) {
      case EntityName.objectType:
        return this.objectsTypeService.entityDefinition;
      case EntityName.objectSubType:
        return this.objectsSubTypeService.getSchema(
          entity as ObjectSubTypeImpl,
          this.getObjectType((entity as ObjectSubTypeImpl).objectTypeId),
          this.objectTypesArray
        );
      case EntityName.objectNode:
        return this.objectNodesService.entityDefinition;
      default:
        throw new Error('Unknown schema');
        break;
    }
  }

  private insertInArray(entities: any[], entity: any, sortKey: string): number {
    const index = _.sortedIndexBy(entities, entity, (o) => {
      return o[sortKey];
    });
    entities.splice(index, 0, entity);
    return index;
    /*
    let index = 0;
    while (
      index < entities.length &&
      entities[index][sortKey] < entity[sortKey]
    ) {
      index++;
    }
    if (index === entities.length) {
      entities.push(entity);
    } else {
      entities.splice(index, 0, entity);
    }*/
  }
  private removeFromArray(entities: any[], entity: any, idKey: string = 'id') {
    entities.splice(
      _.findIndex(entities, (o) => {
        return o[idKey] === entity[idKey];
      }),
      1
    );
  }

  public newEntity<T extends RestEntityImpl<T>>(
    entityName: EntityName,
    entitySpeficities: {
      [specifity: string]: any;
      parentEntity?: IRestEntity;
      entityType?: IRestEntity;
    }
  ): T {
    switch (entityName) {
      case EntityName.objectType:
        return (new ObjectTypeImpl(this.objectsTypeService) as unknown) as T;
        break;
      case EntityName.objectSubType:
        return (new ObjectSubTypeImpl(
          this.objectsSubTypeService,
          entitySpeficities.parentEntity.id,
          entitySpeficities.parentEntity.uri
        ) as unknown) as T;
      case EntityName.objectNode:
        return (new ObjectNodeImpl(
          this.objectNodesService,
          entitySpeficities.parentEntity.id,
          entitySpeficities.parentEntity.uri,
          entitySpeficities.entityType.id,
          entitySpeficities.entityType.uri
        ) as unknown) as T;
      default:
        throw new Error('Method not implemented.');
    }
  }

  public registerNewlyCreatedEntity(
    entityName: EntityName,
    entity: IEntityPropertiesWrapper<IRestEntity>
  ) {
    switch (entityName) {
      case EntityName.objectType:
        const objectType: ObjectTypeImpl = entity as ObjectTypeImpl;
        const index = this.insertInArray(this._objectTypes, objectType, 'name');
        this._objectTypesByName[objectType.name] = this._objectTypes[index];
        this._objectTypesById[objectType.id] = this._objectTypes[index];
        this._objectTypesByUri[objectType.uri] = this._objectTypes[index];
        break;
      case EntityName.objectSubType:
        const objectSubType = entity as ObjectSubTypeImpl;
        const objectSubTypeParent: ObjectTypeImpl = this.getObjectType(
          objectSubType.objectTypeId
        );
        objectSubType.objectType = this.getObjectType(
          objectSubType.subObjectTypeId
        );
        this.insertInArray(
          objectSubTypeParent.objectSubTypes,
          objectSubType,
          'index'
        );
        break;

      case EntityName.objectNode:
        const objectNode = entity as ObjectNodeImpl;
        const parentTree = this.getObjectTree(objectNode.parentNodeId);
        parentTree.addChildren([objectNode], this._objectTypesById);
        this.updateRegisteredTrees(parentTree);
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
        this.removeFromArray(this._objectTypes, objectType);
        delete this._objectTypesByName[objectType.name];
        delete this._objectTypesById[objectType.id];
        delete this._objectTypesByUri[objectType.uri];
        break;
      case EntityName.objectSubType:
        const objectSubType: ObjectSubTypeImpl = entity as ObjectSubTypeImpl;
        const objectSubTypeParent: ObjectTypeImpl = this.getObjectType(
          objectSubType.objectTypeId
        );
        this.removeFromArray(objectSubTypeParent.objectSubTypes, objectSubType);
        break;
      case EntityName.objectNode:
        const objectNode: ObjectNodeImpl = entity as ObjectNodeImpl;
        const objectTree: ObjectTree = this.getObjectTree(objectNode.id);
        this.deleteRegisteredTrees(objectTree);
        break;
      default:
        throw new Error('Method not implemented.');
        break;
    }
  }

  private updateRegisteredTrees(tree: ObjectTree) {
    this._objectTreeNodesById[tree.id] = tree;
    for (const children of _.values(tree.childrenByType)) {
      for (const child of children) {
        this.updateRegisteredTrees(child);
      }
    }
  }
  private deleteRegisteredTrees(tree: ObjectTree) {
    const parentTree = this.getObjectTree(tree.parentId);
    this.removeFromArray(parentTree.childrenByType[tree.treeType.id], tree);
    for (const children of _.values(tree.childrenByType)) {
      for (const child of children) {
        this.deleteRegisteredTrees(child);
      }
    }
    delete this._objectTreeNodesById[tree.id];
  }

  public async getNamespaceTree(
    ownerType: any,
    ownerName: any,
    namespaceType: any,
    namespaceName: any
  ): Promise<ObjectTree> {
    const ownerTreeType = ownerType + '$$' + ownerName + '$$' + namespaceType;
    if (!(ownerTreeType in this._objectTrees)) {
      this._objectTrees[ownerTreeType] = {};
    }
    if (!(namespaceName in this._objectTrees[ownerTreeType])) {
      const nodes = await this.objectNodesService.getAll(
        ownerType,
        ownerName,
        namespaceType,
        namespaceName
      );
      this._objectTrees[ownerTreeType][namespaceName] = new ObjectTree(
        nodes[0],
        nodes,
        this._objectTypesById
      );
      this.updateRegisteredTrees(
        this._objectTrees[ownerTreeType][namespaceName]
      );
    }
    return this._objectTrees[ownerTreeType][namespaceName];
  }

  public async getOwnerTree(
    ownerType: any,
    ownerName: any
  ): Promise<ObjectTree> {
    if (!(ownerType in this._objectTrees)) {
      this._objectTrees[ownerType] = {};
    }
    if (!(ownerName in this._objectTrees[ownerType])) {
      const nodes = await this.objectNodesService.getAll(ownerType, ownerName);
      this._objectTrees[ownerType][ownerName] = new ObjectTree(
        nodes[0],
        nodes,
        this._objectTypesById
      );
      this.updateRegisteredTrees(this._objectTrees[ownerType][ownerName]);
    }
    return this._objectTrees[ownerType][ownerName];
  }

  public async loadSubTree(tree: ObjectTree) {
    if (!tree.childsLoaded) {
      const nodes = await this.objectNodesService.getChilds(tree.id);
      tree.addChildren(nodes, this._objectTypesById);
      this.updateRegisteredTrees(tree);
    }
  }
}
