import { getOwnerName, getRootState } from 'src/app/app.const';
import { CommonComponent } from './../common-component/common-component.component';
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
import { ADMIN_ROUTE_NAME } from 'src/app/admin/admin.const';
import { VIEW_ROUTE_NAME } from 'src/app/view/view.const';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss'],
})
export class AppNavComponent extends CommonComponent implements OnInit {
  @Output() public sizeChanged: EventEmitter<{
    width: number;
    height: number;
  }> = new EventEmitter<{ width: number; height: number }>();
  public loginState = USER_LOGIN_ROUTE_NAME_AND_HREF;
  public registerState = USER_REGISTRATION_ROUTE_NAME_AND_HREF;
  public accountState = USER_ACCOUNT_ROUTE_NAME_AND_HREF;
  public welcomeRootName = WELCOME_STATE_NAME;
  public adminStateName = ADMIN_ROUTE_NAME;
  public viewStateName = VIEW_ROUTE_NAME;
  isUserLogued: boolean;
  user: AppUserImpl;
  public hasAdmin: boolean;

  constructor(
    private userService: UserService,
    private transitionService: TransitionService
  ) {
    super();
    if (getRootState() === ADMIN_ROUTE_NAME) {
      this.welcomeRootName = VIEW_ROUTE_NAME;
    }
  }

  async ngOnInit() {
    super.ngOnInit();
    await this.checkUserStatus();
    this.registerSubscription(
      this.transitionService.onSuccess(
        {},
        (transition: Transition): HookResult => {
          this.checkUserStatus();
          return true;
        }
      )
    );
    this.hasAdmin = !!getOwnerName();
  }

  private async checkUserStatus() {
    const isUserLogued = await this.userService.isUserLoguedIn();
    this.isUserLogued = !!isUserLogued;
    this.user = (this.isUserLogued ? isUserLogued : null) as AppUserImpl;
  }
}
