import { IObjectSubType, IObjectType } from '@jacquesparis/objects-model';
import { ObjectNodeImpl, ObjectTypeImpl } from '@jacquesparis/objects-client';
import * as _ from 'lodash-es';

export class ObjectTree implements IObjectType {
  public childrenByType: { [objectTypeId: string]: ObjectTree[] } = {};
  public treeType: ObjectTypeImpl;
  private _childsLoaded: boolean = false;
  get id(): string {
    return this.treeNode.id;
  }
  get parentId() {
    return this.treeNode.parentNodeId;
  }
  get ChildrenCount(): number {
    return _.reduce(this.childrenByType, (count, children) => {
      return count + children.length;
    });
  }
  get childsLoaded(): boolean {
    return !this.treeNode.tree || this._childsLoaded;
  }
  constructor(
    public treeNode: ObjectNodeImpl,
    objectNodes: ObjectNodeImpl[],
    allObjectTypes: { [typeId: string]: ObjectTypeImpl }
  ) {
    this.treeType = allObjectTypes[treeNode.objectTypeId];
    if (undefined !== this.id) {
      this.addChildren(objectNodes, allObjectTypes, false);
    }
  }
  get name(): string {
    return this.treeNode.name;
  }
  get contentType(): string {
    return this.treeType.contentType;
  }
  get definition(): any {
    return this.treeType.definition;
  }
  get objectSubTypes(): IObjectSubType[] {
    return this.treeType.objectSubTypes;
  }
  get uri(): string {
    return this.treeNode.uri;
  }
  addChildren(
    objectNodes: ObjectNodeImpl[],
    allObjectTypes: { [typeId: string]: ObjectTypeImpl },
    newChildsLoading = true
  ) {
    this._childsLoaded = newChildsLoading;
    objectNodes.forEach((objectNode) => {
      if (objectNode.parentNodeId === this.id) {
        if (!(objectNode.objectTypeId in this.childrenByType)) {
          this.childrenByType[objectNode.objectTypeId] = [];
        }
        this.childrenByType[objectNode.objectTypeId].push(
          new ObjectTree(objectNode, objectNodes, allObjectTypes)
        );
      }
    });
  }
}
