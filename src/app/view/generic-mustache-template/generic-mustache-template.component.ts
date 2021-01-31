import { ObjectsCommonService } from './../../objects-client/services/objects-common.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';
import { Component, OnInit, Inject, Input } from '@angular/core';
import { WebsiteGenerationService } from '../../../../../objects-website/lib';

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
        this.siteTree.id,
        this.pageTree.id,
        this.dataTree.id,
        this.templateTree.id
      )
    );
  }
}
