import { ADMIN_ROUTE_NAME } from './../admin.const';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  public objectsRootName = ADMIN_ROUTE_NAME;

  constructor() {}

  ngOnInit(): void {}
}
