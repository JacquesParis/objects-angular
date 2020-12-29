import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../objects-client/services/objects-common.service';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { OBJECT_TREE_TOKEN } from './../../admin/admin.const';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public ready: boolean = false;
  public templateTree: ObjectTreeImpl;
  constructor(
    @Inject('siteTree') public siteTree: ObjectTreeImpl,
    @Inject('pageTree') public pageTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService
  ) {}

  async ngOnInit() {
    await this.siteTree.waitForReady();
    await this.siteTree.treeNode.waitForReady();
    this.templateTree = this.siteTree.treeNode.webSiteObjectTree;
    await this.templateTree.waitForReady();
    await this.templateTree.treeNode.waitForReady();
    console.log(
      'display siteTree',
      this.siteTree.treeNode.name,
      'templateTree',
      this.templateTree.treeNode.name
    );

    /*    this.templateTree = await this.objectsCommonService.getTreeByUri(
      this.dataTree.treeNode.webSiteObjectTreeUri
    );
*/
    this.ready = true;
  }
}
