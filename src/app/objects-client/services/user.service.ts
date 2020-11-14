import { HttpRestService } from './../../common-app/services/http-rest.service';
import { ConfigurationService } from './../../common-app/services/configuration.service';
import { Injectable } from '@angular/core';
import { AppUserImpl, AppUserService } from '@jacquesparis/objects-client';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private appUserService: AppUserService;
  public nextLogInStateName: string;
  constructor(
    protected configurationService: ConfigurationService,
    protected httpRestService: HttpRestService
  ) {
    this.appUserService = AppUserService.getService(
      this.httpRestService,
      this.configurationService.getServer()
    );
  }

  public login(credentials: {
    email: string;
    password: string;
  }): Promise<AppUserImpl> {
    return this.appUserService.login(credentials);
  }

  logout(): Promise<void> {
    return this.appUserService.logout();
  }

  public isUserLoguedIn(): Promise<boolean | AppUserImpl> {
    return this.appUserService.isUserLoguedIn();
  }
}
