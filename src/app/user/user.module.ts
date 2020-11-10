import { UserAccountComponent } from './user-account/user-account.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserPageComponent } from './user-page/user-page.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { USER_STATES } from './user.route';
import { UIRouterModule } from '@uirouter/angular';
import { CommonAppModule } from './../common-app/common-app.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonAppModule,
    UIRouterModule.forChild({
      states: USER_STATES,
    }),
  ],
  declarations: [
    UserPageComponent,
    UserLoginComponent,
    UserRegistrationComponent,
    UserAccountComponent,
  ],
})
export class UserModule {}
