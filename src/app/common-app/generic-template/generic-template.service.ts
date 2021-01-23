import { DynamicTemplateDirective } from './dynamic-template.dircetive';
import { CommonAppModule } from './../common-app.module';
import {
  GenericObjectComponent,
  IGenericObjectComponent,
} from './generic-object.component';
import {
  Compiler,
  Component,
  ComponentFactory,
  ComponentRef,
  Injectable,
  NgModule,
  Type,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GenericTemplateService {
  private templates: {
    [id: string]: Promise<ComponentFactory<GenericObjectComponent>>;
  } = {};

  constructor(protected compiler: Compiler) {}
  private hashCode(str, seed = 0) {
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

  public async getComponent(
    template: string,
    scss: string,
    dynamicTemplatePlaceholder: DynamicTemplateDirective,
    components: Type<any>[] = []
  ): Promise<ComponentRef<IGenericObjectComponent>> {
    const templateId = this.hashCode(template + scss);
    if (!(templateId in this.templates)) {
      const tmpCmp: any = Component({
        template:
          '<div class="template-holder" *ngIf="templateReady">' +
          template +
          '</div>',
        styles: [scss],
      })(class extends GenericObjectComponent {});
      const tmpModule = NgModule({
        imports: [CommonAppModule],
        declarations: [tmpCmp, ...components],
        entryComponents: [tmpCmp],
      })(class {});

      this.templates[templateId] = new Promise((resolve, reject) => {
        this.compiler.compileModuleAndAllComponentsAsync(tmpModule).then(
          (factories) => {
            resolve(
              factories.componentFactories.find(
                (component) => 'ng-component' === component.selector
              )
            );
          },
          (error) => reject
        );
      });
    }

    const viewContainerRef = dynamicTemplatePlaceholder.viewContainer;
    //  viewContainerRef.clear();

    return viewContainerRef.createComponent<IGenericObjectComponent>(
      await this.templates[templateId]
    );
  }
}
