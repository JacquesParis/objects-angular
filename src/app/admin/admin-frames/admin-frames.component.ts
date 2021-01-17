import { StateService } from '@uirouter/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-frames',
  templateUrl: './admin-frames.component.html',
  styleUrls: ['./admin-frames.component.scss'],
})
export class AdminFramesComponent {
  constructor(protected stateService: StateService) {}
}
