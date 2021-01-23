import { GenericTemplateService } from './../../common-app/generic-template/generic-template.service';
import { async } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { VIEW_PAGE_ROUTE_NAME } from './../view.const';
import { OBJECT_TREE_TOKEN } from './../../admin/admin.const';
import { StateService } from '@uirouter/angular';
import { DynamicTemplateDirective } from '../../common-app/generic-template/dynamic-template.dircetive';
import { CommonAppModule } from './../../common-app/common-app.module';
import {
  ChangeDetectorRef,
  Compiler,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  Input,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  GenericObjectComponent,
  IGenericObjectComponent,
} from '../../common-app/generic-template/generic-object.component';
import { ObjectTreeImpl } from '@jacquesparis/objects-client';

@Component({
  selector: 'app-template,[template]',
  templateUrl: './generic-template.component.html',
  styleUrls: ['./generic-template.component.scss'],
})
export class GenericTemplateComponent implements OnInit {
  static templates: {
    [id: string]: ComponentFactory<IGenericObjectComponent>;
  } = {};
  @Input() templateTree: ObjectTreeImpl;
  @Input() dataTree: ObjectTreeImpl;
  @Input() params: any;
  @ViewChild(DynamicTemplateDirective)
  dynamicTemplatePlaceholder: DynamicTemplateDirective;
  protected componentRef: ComponentRef<IGenericObjectComponent>;
  public siteTemplateTree: ObjectTreeImpl;

  constructor(
    protected compiler: Compiler,
    @Inject('siteTree') public siteTree: ObjectTreeImpl,
    @Inject('pageTree') public pageTree: ObjectTreeImpl,
    public sanitization: DomSanitizer,
    public stateService: StateService,
    public changeDetectorRef: ChangeDetectorRef,
    private genericTemplateService: GenericTemplateService
  ) {}

  async ngOnInit() {
    console.log(
      'dataNode',
      this.dataTree?.treeNode?.name,
      'templateTree',
      this.templateTree?.treeNode?.name,
      'siteNode',
      this.siteTree?.treeNode?.name,
      'pageNode',
      this.pageTree?.treeNode?.name
    );
    await this.dataTree.waitForReady();
    await this.dataTree.treeNode.waitForReady();
    await this.templateTree.waitForReady();
    await this.templateTree.treeNode.waitForReady();

    this.siteTemplateTree = this.siteTree.treeNode.webSiteTree;
    if (this.siteTemplateTree) {
      await this.siteTemplateTree.waitForReady();
      await this.siteTemplateTree.treeNode.waitForReady();
      console.log('siteTemplateTree', this.siteTemplateTree?.treeNode?.name);
    }
    await this.siteTree.waitForReady();
    await this.siteTree.treeNode.waitForReady();

    if (this.pageTree) {
      await this.pageTree.waitForReady();
      await this.pageTree.treeNode.waitForReady();
    }
    const template =
      this.templateTree.treeNode.contentGenericTemplate?.template ||
      'Missing template for {{dataTree.treeNode.name}} {{templateTree.treeNode.name}}';
    const scss = this.templateTree.treeNode.contentGenericTemplate?.scss || '';

    this.componentRef = await this.genericTemplateService.getComponent(
      template,
      scss,
      this.dynamicTemplatePlaceholder,
      [GenericTemplateComponent, DynamicTemplateDirective]
    );

    const controller =
      this.templateTree.treeNode.contentGenericTemplate?.controller || '{}';
    try {
      const ctrl = eval(controller);
      if (!ctrl.init) {
        ctrl.init = async (
          component: IGenericObjectComponent
        ): Promise<void> => {
          console.log('Initialising ' + component.dataNode.name + ' display');
        };
      }
      ctrl.ctrl = this.componentRef.instance;
      //  ctrl.ctrl = this.componentRef.instance;
      this.componentRef.instance.ctrl = ctrl;
    } catch (error) {}
    this.componentRef.instance.stateService = this.stateService;
    this.componentRef.instance.sanitization = this.sanitization;
    this.componentRef.instance.changeDetectorRef = this.changeDetectorRef;
    /*
    this.componentRef.instance.thingObject = object;
    this.componentRef.instance.typeConfig = config;*/
    this.componentRef.instance.params = this.params;
    this.componentRef.instance.templateTree = this.templateTree;
    this.componentRef.instance.dataTree = this.dataTree;
    this.componentRef.instance.siteTree = this.siteTree;
    this.componentRef.instance.pageTree = this.pageTree;
    this.componentRef.instance.siteTemplateTree = this.siteTemplateTree;
    await this.componentRef.instance.ctrl.init(this.componentRef.instance);
    this.componentRef.instance.ready = true;

    /*    if (!('initComponent' in this.componentRef.instance)) {
      this.componentRef.instance['initComponent'] = () => {
        this.componentRef.instance['templateReady'] = true;
      };
    }*/

    this.componentRef.instance.initComponent();
  }
  ngAfterViewInit() {}
}
