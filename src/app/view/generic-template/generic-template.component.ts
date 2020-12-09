import { OBJECT_TREE_TOKEN } from './../../admin/admin.const';
import { StateService } from '@uirouter/angular';
import { DynamicTemplateDirective } from './dynamic-template.dircetive';
import { CommonAppModule } from './../../common-app/common-app.module';
import {
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
} from './generic-object.component';
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

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    protected compiler: Compiler,
    private stateService: StateService,
    @Inject(OBJECT_TREE_TOKEN) public siteTree: ObjectTreeImpl,
    @Inject('pageTree') public pageTree: ObjectTreeImpl
  ) {}

  hashCode(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  async ngOnInit() {
    await this.dataTree.waitForReady();
    await this.dataTree.treeNode.waitForReady();
    await this.templateTree.waitForReady();
    await this.templateTree.treeNode.waitForReady();
    if (this.pageTree) {
      await this.pageTree.waitForReady();
      await this.pageTree.treeNode.waitForReady();
    }
    const template =
      this.templateTree.treeNode.template ||
      'Missing template for {{dataTree.treeNode.name}}';
    const templateId = this.hashCode(template);

    if (!(templateId in GenericTemplateComponent.templates)) {
      const tmpCmp: any = Component({
        template:
          '<div class="template-holder" *ngIf="templateReady">' +
          template +
          '</div>',
      })(class extends GenericObjectComponent {});
      const tmpModule = NgModule({
        imports: [CommonAppModule],
        declarations: [
          tmpCmp,
          GenericTemplateComponent,
          DynamicTemplateDirective,
        ],
        entryComponents: [tmpCmp],
      })(class {});
      const factories = await this.compiler.compileModuleAndAllComponentsAsync(
        tmpModule
      );
      GenericTemplateComponent.templates[
        templateId
      ] = factories.componentFactories.find(
        (component) => 'ng-component' === component.selector
      );
    }

    const viewContainerRef = this.dynamicTemplatePlaceholder.viewContainer;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent<IGenericObjectComponent>(
      GenericTemplateComponent.templates[templateId]
    );
    /*
    this.componentRef.instance.thingObject = object;
    this.componentRef.instance.typeConfig = config;*/
    this.componentRef.instance.params = this.params;
    this.componentRef.instance.templateTree = this.templateTree;
    this.componentRef.instance.dataTree = this.dataTree;
    this.componentRef.instance.siteTree = this.siteTree;
    this.componentRef.instance.pageTree = this.pageTree;
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
