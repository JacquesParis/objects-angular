import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IActionsLoggingService } from '@jacquesparis/objects-client';
import {
  IWaitingStateService,
  EditableFormService,
} from '@jacquesparis/objects-angular-forms';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService
  implements IActionsLoggingService, IWaitingStateService {
  protected runningActions: { [id: string]: number } = {};
  public currentRunningActions: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public percentageDone: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  private calculateCurrentRunningActions(): void {
    this.currentRunningActions.next(
      Object.values(this.runningActions).reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      )
    );
  }
  public maxRunningActions = 1;
  private calculatePercentageDone(): void {
    this.percentageDone.next(
      Math.round(
        ((this.maxRunningActions - this.currentRunningActions.value) /
          this.maxRunningActions) *
          100
      )
    );
  }

  constructor(private editableFormService: EditableFormService) {
    this.editableFormService.registerWaitingStateService(this);
  }
  initAction(id: string): void {
    if (!(id in this.runningActions)) {
      this.runningActions[id] = 0;
    }
    this.runningActions[id]++;
    this.calculateCurrentRunningActions();
    if (1 === this.currentRunningActions.value) {
      this.maxRunningActions = 1;
    } else {
      this.maxRunningActions++;
    }
    this.calculatePercentageDone();
  }
  endAction(id: string): void {
    if (id in this.runningActions && this.runningActions[id] > 0) {
      this.runningActions[id]--;
      this.calculateCurrentRunningActions();
      if (0 === this.currentRunningActions.value) {
        this.maxRunningActions = 1;
      }
      this.calculatePercentageDone();
    }
  }
  initSteps(id: string, nbSteps: number): void {
    this.runningActions[id] = nbSteps;
    this.calculateCurrentRunningActions();
    if (this.maxRunningActions < this.currentRunningActions.value) {
      this.maxRunningActions = this.currentRunningActions.value;
    }
    this.calculatePercentageDone();
  }
  endSteps(id: string): void {
    if (id in this.runningActions && this.runningActions[id] > 0) {
      this.runningActions[id] = 0;
      this.calculateCurrentRunningActions();
      if (0 === this.currentRunningActions.value) {
        this.maxRunningActions = 1;
      }
      this.calculatePercentageDone();
    }
  }
}
