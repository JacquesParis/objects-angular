import { ObjectsCommonService } from './../../objects-client/services/objects-common.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { WebsiteGenerationService } from '../../../../../objects-website/lib';
import { IObjectTree } from '@jacquesparis/objects-model';

@Component({
  selector: '[mustache-template]',
  templateUrl: './generic-mustache-template.component.html',
  styleUrls: ['./generic-mustache-template.component.scss'],
})
export class GenericMustacheTemplateComponent implements OnInit {
  @Input() templateTree: ObjectTreeImpl;
  @Input() dataTree: ObjectTreeImpl;
  public content: SafeHtml;

  constructor(
    @Inject('siteTree') public siteTree: ObjectTreeImpl,
    @Inject('pageTree') public pageTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    public sanitization: DomSanitizer
  ) {}

  async ngOnInit() {
    this.content = this.sanitization.bypassSecurityTrustHtml(
      await WebsiteGenerationService.get().getTamplateContent(
        this.objectsCommonService.objectTreesService,
        this.objectsCommonService.objectNodesService,
        this,
        this.siteTree.id,
        this.pageTree.id,
        this.dataTree.id,
        this.templateTree.id
      )
    );
  }

  public getPageHref(page: IObjectTree): string {
    return (
      '#/view/' + this.siteTree.id + '/' + (page ? page.treeNode.id : 'default')
    );
  }

  public getAdminHref(page: IObjectTree): string {
    return (
      '#/admin/owner/' +
      page.ownerType +
      '/' +
      page.ownerName +
      '/namespace/' +
      page.namespaceType +
      '/' +
      page.namespaceName
    );
  }
}
