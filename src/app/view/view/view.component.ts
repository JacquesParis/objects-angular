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
    @Inject(OBJECT_TREE_TOKEN) public dataTree: ObjectTreeImpl,
    @Inject('pageTree') public pageTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService
  ) {}

  async ngOnInit() {
    await this.dataTree.waitForReady();
    await this.dataTree.treeNode.waitForReady();
    this.templateTree = this.dataTree.treeNode.webSiteObjectTree;
    await this.templateTree.waitForReady();
    await this.templateTree.treeNode.waitForReady();

    /*    this.templateTree = await this.objectsCommonService.getTreeByUri(
      this.dataTree.treeNode.webSiteObjectTreeUri
    );
*/
    this.ready = true;
  }
}
