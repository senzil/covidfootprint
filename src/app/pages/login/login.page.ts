import { Component, OnInit, AfterViewChecked } from '@angular/core';

// Services
import { LoginService } from 'src/app/services/login-service/login.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { AlertService } from 'src/app/services/alert-service/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, AfterViewChecked {

  constructor(
    private loginManager: LoginService,
    private loadManager: LoadingService,
    private alertManager: AlertService,
    private translate: TranslateService
  ) { }

  ngAfterViewChecked(): void {
    /* if (localStorage.getItem('logintour') !== 'done' && !this.loginManager.isUserLogged() && this.router.isActive('login', true)) {
      this.joyride.startTour({
        steps: ['init1', 'init2', 'init3', 'init4'],
        customTexts: {
          prev: this.translate.instant('COMPONENTS.TOUR.PREVIUS'),
          next: this.translate.instant('COMPONENTS.TOUR.NEXT'),
          done: this.translate.instant('COMPONENTS.TOUR.DONE'),
        }
      }).subscribe({
        complete: () => {
          this.joyride.closeTour();
          localStorage.setItem('logintour', 'done');
        }
      });
    } */
  }

  ngOnInit() {
  }

  private async AuthProcess(provider: Promise<boolean>): Promise<void> {
    const loader: HTMLIonLoadingElement = await this.loadManager.simpleMessage(this.translate.instant('COMMONS.CARGANDO'));
    const logged: boolean = await provider;
    this.loadManager.dismiss(loader);
    if (logged) { return; }
    this.alertManager.simple(this.translate.instant('COMMONS.ALERTA'), this.translate.instant('COMPONENTS.LOGIN.ERROR'));
    return;
  }

  public async GoogleAuth(): Promise<void> {
    return this.AuthProcess(this.loginManager.GoogleAuth());
  }

  public async FacebookAuth(): Promise<void> {
    return this.AuthProcess(this.loginManager.FacebookAuth());

  }

  public async TwitterAuth(): Promise<void> {
    return this.AuthProcess(this.loginManager.TwitterAuth());

  }

}
