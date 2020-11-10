import { WELCOME_STATE_NAME } from './../../app.const';
import {
  ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME,
  ROOT_ADMIN_OBJECTS_LIST_ROUTE_NAME,
} from './../root-admin.const';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root-admin',
  templateUrl: './root-admin.component.html',
  styleUrls: ['./root-admin.component.scss'],
})
export class RootAdminComponent implements OnInit {
  welcomeRootName = WELCOME_STATE_NAME;
  objectTypesRootName = ROOT_ADMIN_OBJECTS_TYPES_LIST_ROUTE_NAME;
  objectsRootName = ROOT_ADMIN_OBJECTS_LIST_ROUTE_NAME;
  constructor() {}

  ngOnInit(): void {}
}
