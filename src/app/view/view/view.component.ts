import { getOwnerName } from 'src/app/app.const';
import { StateService, TransitionService } from '@uirouter/angular';
import { ObjectsCommonService } from './../../objects-client/services/objects-common.service';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { OBJECT_TREE_TOKEN, ADMIN_ROUTE_NAME } from './../../admin/admin.const';
import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/objects-client/services/user.service';
import { NavigationService } from 'src/app/objects-client/services/navigation.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  public ready: boolean = false;
  public templateTree: ObjectTreeImpl;
  public adminStateName = ADMIN_ROUTE_NAME;
  public isUserLogued: boolean;
  public hasAdmin: boolean;

  constructor(
    @Inject('siteTree') public siteTree: ObjectTreeImpl,
    @Inject('pageTree') public pageTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    protected stateService: StateService,
    private userService: UserService,
    private transitionService: TransitionService,
    public navigationService: NavigationService
  ) {}

  async ngOnInit() {
    await this.siteTree.waitForReady();
    await this.siteTree.treeNode.waitForReady();
    this.templateTree = this.siteTree.treeNode.webSiteTree;
    await this.templateTree.waitForReady();
    await this.templateTree.treeNode.waitForReady();

    window.scrollTo(0, 0);
    /*    this.templateTree = await this.objectsCommonService.getTreeByUri(
      this.dataTree.treeNode.webSiteObjectTreeUri
    );
*/
    await this.checkUserStatus();
    this.hasAdmin = !!getOwnerName();
    this.ready = true;
  }

  private async checkUserStatus() {
    const isUserLogued = await this.userService.isUserLoguedIn();
    this.isUserLogued = !!isUserLogued;
  }
}
