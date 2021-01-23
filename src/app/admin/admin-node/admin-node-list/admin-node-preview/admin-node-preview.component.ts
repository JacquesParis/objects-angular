import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: '[app-admin-node-preview]',
  templateUrl: './admin-node-preview.component.html',
  styleUrls: ['./admin-node-preview.component.scss'],
})
export class AdminNodePreviewComponent implements OnInit {
  @Input() treeNode: ObjectTreeImpl;
  preView: SafeHtml;

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnInit() {
    this.preView = this.domSanitizer.bypassSecurityTrustHtml(
      this.treeNode.entityCtx.preview.html
    );
  }
}
