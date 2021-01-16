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

@Component({
  selector: 'app-side-menu, [app-side-menu]',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent extends CommonComponent {
  @Input() leftMenuId: string =
    'menu_' + Math.ceil(Math.random() * 10000000000000000);
  public isLeftSidebarShown = true;

  public height = '100vh';
  constructor(private managementPageService: ManagementPageService) {
    super();
    this.registerSubscription(
      this.managementPageService.subscribeMargingTop((margin: number) => {
        this.height = 'calc(100vh - ' + margin + 'px )';
      })
    );
  }

  public hideLeftSide() {
    this.isLeftSidebarShown = false;
  }
  public showLeftSide() {
    this.isLeftSidebarShown = true;
  }
}
