import { CommonComponent } from './../common-component/common-component.component';
import { ManagementPageService } from './management-page.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
})
export class ManagementPageComponent
  extends CommonComponent
  implements AfterViewInit {
  public afterInit = false;
  public bodyMargingTop: number;
  public currentRunningActions = 1;
  public percentageDone = 0;
  constructor(
    private managementPageService: ManagementPageService,
    public spinnerService: SpinnerService
  ) {
    super();
    this.registerSubscription(
      spinnerService.currentRunningActions.subscribe(
        (currentRunningActions) => {
          window.setTimeout(() => {
            this.currentRunningActions = currentRunningActions;
          });
        }
      )
    );
    this.registerSubscription(
      spinnerService.percentageDone.subscribe((percentageDone) => {
        window.setTimeout(() => {
          this.percentageDone = percentageDone;
        });
      })
    );
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
