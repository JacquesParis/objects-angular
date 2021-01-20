import { SideMenuService } from './side-menu.service';
import { LocalStorageWorker } from './../../tools/local-storage-worker';
import { CommonComponent } from './../common-component/common-component.component';
import { ManagementPageService } from './../management-page/management-page.service';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { filter } from 'lodash-es';

@Component({
  selector: 'app-side-menu, [app-side-menu]',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  providers: [SideMenuService],
})
export class SideMenuComponent
  extends CommonComponent
  implements OnInit, AfterViewInit {
  @Input() id: string;
  @Input() defaultLeftSidebarShown = true;
  @ViewChild('leftSidebar') leftSidebar: ElementRef<HTMLElement>;
  @ViewChild('component') component: ElementRef<HTMLElement>;
  public leftMenuId: string;
  public isLeftSidebarShown = true;
  public saveSideBarsStatus: boolean = false;

  public top = '0';
  constructor(
    private managementPageService: ManagementPageService,
    private sideMenuService: SideMenuService
  ) {
    super();
    this.sideMenuService.initService(this);
    this.registerSubscription(
      this.managementPageService.subscribeMargingTop((margin: number) => {
        this.top = '' + margin + 'px';
      })
    );
  }

  public get isFullLeftSide(): boolean {
    return (
      this.component &&
      this.leftSidebar &&
      this.component.nativeElement.offsetWidth ===
        this.leftSidebar.nativeElement.offsetWidth
    );
  }

  showMainContent() {
    if (this.isFullLeftSide) {
      this.leftSidebar.nativeElement.classList.remove('show');
      this.leftSidebarShown = false;
    }
  }

  showLeftSideMenu() {
    if (!this.isLeftSidebarShown) {
      this.leftSidebar.nativeElement.classList.add('show');
      this.leftSidebarShown = true;
    }
  }

  public get isMainContentHidden() {
    return this.isFullLeftSide;
  }

  ngOnInit() {
    super.ngOnInit();
    if (!this.id) {
      this.id = 'panel_' + Math.ceil(Math.random() * 10000000000000000);
      this.leftSidebarShown = this.defaultLeftSidebarShown;
    } else {
      this.saveSideBarsStatus = true;
      this.getConfig('isLeftSidebarShown', this.defaultLeftSidebarShown);
    }
    this.leftMenuId = 'left_' + this.id;
  }
  ngAfterViewInit() {
    if (this.isLeftSidebarShown) {
      this.leftSidebar.nativeElement.classList.add('show');
    }
  }

  protected setConfig(configId: string, value: any) {
    this[configId] = value;
    if (this.saveSideBarsStatus) {
      LocalStorageWorker.add(
        'onoff_' + configId + '_' + this.id,
        this[configId]
      );
    }
  }

  protected getConfig(configId: string, defaultValue: any) {
    if (this.saveSideBarsStatus) {
      this[configId] = LocalStorageWorker.get(
        'onoff_' + configId + '_' + this.id,
        defaultValue
      );
    } else {
      this[configId] = defaultValue;
    }
  }

  protected set leftSidebarShown(value) {
    this.setConfig('isLeftSidebarShown', value);
  }

  public hideLeftSide() {
    this.leftSidebarShown = false;
  }
  public showLeftSide() {
    this.leftSidebarShown = true;
  }
}
