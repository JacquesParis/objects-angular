import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-management-page',
  templateUrl: './management-page.component.html',
  styleUrls: ['./management-page.component.scss'],
})
export class ManagementPageComponent implements OnInit, AfterViewInit {
  public afterInit = false;
  public bodyMargingTop: number;
  constructor() {}
  ngOnInit(): void {}

  calculateMarginTop(size: { width: number; height: number }) {
    if (size?.height && size?.height !== this.bodyMargingTop) {
      this.bodyMargingTop = size?.height;
    }
  }

  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.afterInit = true;
    }, 0);
  }
}
