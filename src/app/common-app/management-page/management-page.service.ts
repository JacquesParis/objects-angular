import { BehaviorSubject, PartialObserver, Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ManagementPageService {
  private bodyMargingTopSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  constructor() {}

  public set margingTop(value: number) {
    this.bodyMargingTopSubject.next(value);
  }
  public get margingTop(): number {
    return this.bodyMargingTopSubject.value;
  }

  public subscribeMargingTop(observer: (value: number) => void): Subscription {
    return this.bodyMargingTopSubject.asObservable().subscribe(observer);
  }
}
