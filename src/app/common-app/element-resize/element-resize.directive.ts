import {
  Directive,
  OnInit,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Directive({
  selector: '[appResize]',
})
export class ElementResizeDirective
  implements OnInit, OnDestroy, AfterViewInit {
  @Output() public sizeChanged: EventEmitter<{
    width: number;
    height: number;
  }> = new EventEmitter<{ width: number; height: number }>();
  private interval = interval(1000);
  private intervalSub: Subscription;
  private value: { width: number; height: number };
  constructor(private ref: ElementRef) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.value = {
      width: this.ref.nativeElement.offsetWidth,
      height: this.ref.nativeElement.offsetHeight,
    };
    this.sizeChanged.emit(this.value);
    this.watchElementChanges();
  }
  private watchElementChanges(): void {
    this.intervalSub = this.interval.subscribe(() => {
      if (
        this.ref.nativeElement.offsetWidth !== this.value.width ||
        this.ref.nativeElement.offsetHeight !== this.value.height
      ) {
        this.value = {
          width: this.ref.nativeElement.offsetWidth,
          height: this.ref.nativeElement.offsetHeight,
        };
        this.sizeChanged.emit(this.value);
      }
    });
  }
}
