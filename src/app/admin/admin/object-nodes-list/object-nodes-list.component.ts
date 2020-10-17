import { ObjectTree } from './../../../objects-client/models/object-tree';
import { OBJECT_TREE_TOKEN } from './../../admin.const';
import { Component, Inject, OnInit } from '@angular/core';
import { ObjectNodeImpl } from '@jacquesparis/objects-client';

export enum ObjectNodesListMode {
  fullScreen = 'fullScreen',
}

@Component({
  selector: 'app-object-nodes-list',
  templateUrl: './object-nodes-list.component.html',
  styleUrls: ['./object-nodes-list.component.scss'],
})
export class ObjectNodesListComponent implements OnInit {
  public viewMode = ObjectNodesListMode.fullScreen;
  get objectRoot(): ObjectNodeImpl {
    return this.objectTree[0];
  }

  constructor(@Inject(OBJECT_TREE_TOKEN) public objectTree: ObjectTree) {}

  ngOnInit(): void {}
}
