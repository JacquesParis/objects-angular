import { StateService } from '@uirouter/angular';
import { SpinnerService } from './../../common-app/services/spinner.service';
import { ConfigurationService } from './../../common-app/services/configuration.service';
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
  public id = '' + Math.ceil(Math.random() * 10000000000000000);

  constructor(
    @Inject('siteTree') public siteTree: ObjectTreeImpl,
    @Inject('pageTree') public pageTree: ObjectTreeImpl,
    protected objectsCommonService: ObjectsCommonService,
    public sanitization: DomSanitizer,
    public configurationService: ConfigurationService,
    private spinnerService: SpinnerService,
    protected stateService: StateService
  ) {}

  async ngOnInit() {
    this.spinnerService.initSteps('generate-mustache');
    this.content = this.sanitization.bypassSecurityTrustHtml(
      await WebsiteGenerationService.get().getTemplateContent(
        this.objectsCommonService.objectTreesService,
        this.objectsCommonService.objectNodesService,
        this,
        this.siteTree.id,
        this.pageTree.id,
        this.dataTree.id,
        this.templateTree.id
      )
    );
    this.spinnerService.endSteps('generate-mustache');
    window.setTimeout(this.postDisplayActions.bind(this));
  }
  public postDisplayActions() {
    const includedScript = document.querySelector(
      '#holder_' + this.id + ' script'
    );
    if (includedScript) {
      const value = includedScript['text'];
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.appendChild(document.createTextNode(value));
      document.body.appendChild(script);
    }
    if (this.stateService.params['#']) {
      const selector =
        '#' + this.stateService.params['#'].replace(/\./g, '\\.');
      let anchor: HTMLElement = document.querySelector(selector);
      if (anchor) {
        let top = anchor.offsetTop;
        while (anchor.offsetParent) {
          anchor = anchor.offsetParent as HTMLElement;
          top += anchor.offsetTop ? anchor.offsetTop : 0;
        }
        const fixedTop: HTMLElement = document.querySelector('.fixed-top');
        if (fixedTop) {
          top = Math.max(0, top - fixedTop.offsetHeight);
        }
        window.scrollTo(0, top);
      }
    }
  }

  public getServerUri(uri: string) {
    if (uri.startsWith('/')) {
      return this.configurationService.getHostName() + uri;
    }
    return uri;
  }

  public getPageHref(page: IObjectTree): string {
    return (
      '#/view/' + this.siteTree.id + '/' + (page ? page.treeNode.id : 'default')
    );
  }
  public getPopupHref(page: IObjectTree): string {
    return this.getServerUri(
      `/api/object-trees/${this.siteTree.id}/view/popup/${
        page ? page.treeNode.id : 'default'
      }`
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
