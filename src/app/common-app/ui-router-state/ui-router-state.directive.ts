import {
  HookResult,
  StateDeclaration,
  StateService,
  Transition,
  TransitionService,
} from '@uirouter/angular';
import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appUiRouterState]',
})
export class UiRouterStateDirective implements OnDestroy, OnInit {
  @Input('appUiRouterState') state: { stateName: string; href: string };
  // tslint:disable-next-line: ban-types
  registered: Function;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private stateService: StateService,
    private transitionService: TransitionService
  ) {}
  ngOnInit() {
    this.elementRef.nativeElement.href = this.state.href;
    this.switchActiveMode(this.stateService.current);
    this.registered = this.transitionService.onSuccess(
      {},
      (transition: Transition): HookResult => {
        this.switchActiveMode(transition.to());
        return true;
      }
    );
  }
  private switchActiveMode(stateDeclaration: StateDeclaration) {
    if (stateDeclaration.name.startsWith(this.state.stateName)) {
      this.renderer.addClass(this.elementRef.nativeElement, 'active');
    } else {
      this.renderer.removeClass(this.elementRef.nativeElement, 'active');
    }
  }
  ngOnDestroy() {
    if (this.registered) {
      this.registered();
    }
  }
}
