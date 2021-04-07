import { CommonComponent } from './../../../../common-app/common-component/common-component.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: '[app-admin-node-preview]',
  templateUrl: './admin-node-preview.component.html',
  styleUrls: ['./admin-node-preview.component.scss'],
})
export class AdminNodePreviewComponent
  extends CommonComponent
  implements OnInit {
  @Input() objectTree: ObjectTreeImpl;
  preView: SafeHtml;

  constructor(private domSanitizer: DomSanitizer) {
    super();
  }

  async ngOnInit() {
    super.ngOnInit();
    this.calculatePreview();
    if (this.objectTree.waitForReady) {
      await this.objectTree.waitForReady();
      this.calculatePreview();
    }
    if (this.objectTree.onChange) {
      this.registerSubscription(
        this.objectTree.onChange(() => {
          this.calculatePreview();
        })
      );
    }
  }

  calculatePreview() {
    this.preView = this.domSanitizer.bypassSecurityTrustHtml(
      this.objectTree.entityCtx?.preview?.html
        ? this.objectTree.entityCtx.preview.html
        : this.objectTree.treeNode.name
    );
  }
}
