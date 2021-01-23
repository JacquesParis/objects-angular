import { GenericTemplateService } from './../../../../common-app/generic-template/generic-template.service';
import { DynamicTemplateDirective } from './../../../../common-app/generic-template/dynamic-template.dircetive';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ComponentRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { IGenericObjectComponent } from 'src/app/common-app/generic-template/generic-object.component';

@Component({
  selector: '[app-admin-node-preview]',
  templateUrl: './admin-node-preview.component.html',
  styleUrls: ['./admin-node-preview.component.scss'],
})
export class AdminNodePreviewComponent implements AfterViewInit {
  @Input() treeNode: ObjectTreeImpl;
  @ViewChild(DynamicTemplateDirective)
  dynamicTemplatePlaceholder: DynamicTemplateDirective;
  previewComponent: ComponentRef<IGenericObjectComponent>;

  constructor(
    private genericTemplateService: GenericTemplateService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngAfterViewInit() {
    const typeTemplate =
      this.treeNode.entityCtx &&
      this.treeNode.entityCtx.preview &&
      this.treeNode.entityCtx.preview.template
        ? this.treeNode.entityCtx.preview.template
        : `<h5
    class="d-inline"
  >
    {{ dataNode.name }}
  </h5>`;
    const template =
      '<span class="child-preview-holder">' + typeTemplate + '</span>';
    const scss = '';

    this.previewComponent = await this.genericTemplateService.getComponent(
      template,
      scss,
      this.dynamicTemplatePlaceholder
    );
    this.previewComponent.instance.dataTree = this.treeNode;
    this.previewComponent.instance.initComponent();
    this.changeDetectorRef.detectChanges();
  }
}
