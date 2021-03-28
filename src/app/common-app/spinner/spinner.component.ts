import { Component, OnInit } from '@angular/core';
import { CommonComponent } from '../common-component/common-component.component';
import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: '[app-spinner]',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent extends CommonComponent implements OnInit {
  public currentRunningActions = 1;
  public percentageDone = 0;
  constructor(public spinnerService: SpinnerService) {
    super();
    this.registerSubscription(
      spinnerService.currentRunningActions.subscribe(() => {
        window.setTimeout(() => {
          this.currentRunningActions =
            spinnerService.currentRunningActions.value;
        });
      })
    );
    this.registerSubscription(
      spinnerService.percentageDone.subscribe(() => {
        window.setTimeout(() => {
          this.percentageDone = spinnerService.percentageDone.value;
        });
      })
    );
  }

  ngOnInit() {}
}
