import { Component } from '@angular/core';
import { ROOT_ADMIN_ROUTE_NAME } from './root-admin/root-admin.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'objectsites';
  rootAdminStateName = ROOT_ADMIN_ROUTE_NAME;
}
