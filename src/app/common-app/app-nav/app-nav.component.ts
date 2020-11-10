import {
  USER_ACCOUNT_ROUTE_NAME_AND_HREF,
  USER_REGISTRATION_ROUTE_NAME_AND_HREF,
  USER_LOGIN_ROUTE_NAME_AND_HREF,
} from './../../user/user.const';
import { AppUserImpl } from '@jacquesparis/objects-client';
import { UserService } from './../../objects-client/services/user.service';
import { HookResult, Transition, TransitionService } from '@uirouter/angular';
import { WELCOME_STATE_NAME } from './../../app.const';
import {
  Component,
  OnDestroy,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss'],
})
export class AppNavComponent implements OnInit, OnDestroy {
  @Output() public sizeChanged: EventEmitter<{
    width: number;
    height: number;
  }> = new EventEmitter<{ width: number; height: number }>();
  public loginState = USER_LOGIN_ROUTE_NAME_AND_HREF;
  public registerState = USER_REGISTRATION_ROUTE_NAME_AND_HREF;
  public accountState = USER_ACCOUNT_ROUTE_NAME_AND_HREF;
  public welcomeRootName = WELCOME_STATE_NAME;
  isUserLogued: boolean;
  user: AppUserImpl;
  // tslint:disable-next-line: ban-types
  regitered: Function;

  constructor(
    private userService: UserService,
    private transitionService: TransitionService
  ) {}

  async ngOnInit() {
    await this.checkUserStatus();
    this.regitered = this.transitionService.onSuccess(
      {},
      (transition: Transition): HookResult => {
        this.checkUserStatus();
        return true;
      }
    );
  }

  private async checkUserStatus() {
    const isUserLogued = await this.userService.isUserLoguedIn();
    this.isUserLogued = !!isUserLogued;
    this.user = (this.isUserLogued ? isUserLogued : null) as AppUserImpl;
  }

  ngOnDestroy() {
    if (this.regitered) {
      this.regitered();
    }
  }
}
