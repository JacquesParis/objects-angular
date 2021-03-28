import { CommonComponent } from './../common-component/common-component.component';
import { ManagementPageService } from './management-page.service';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
})
export class ManagementPageComponent
  extends CommonComponent
  implements AfterViewInit {
  public afterInit = false;
  public bodyMargingTop: number;
  constructor(private managementPageService: ManagementPageService) {
    super();
  }

  calculateMarginTop(size: { width: number; height: number }) {
    if (size?.height && size?.height !== this.bodyMargingTop) {
      this.bodyMargingTop = size?.height;
      this.managementPageService.margingTop = this.bodyMargingTop;
    }
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.afterInit = true;
    }, 0);
  }
}
