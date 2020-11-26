import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from '../alert-service/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {

  constructor(private readonly updates: SwUpdate, private translate: TranslateService, private alert: AlertService) {
    this.updates.available.subscribe(event => {
      this.showAppUpdateAlert();
    });
  }

  showAppUpdateAlert() {
    this.alert.simpleWithAction(
      this.translate.instant('COMPONENTS.APPUPDATE.HEADER'),
      this.translate.instant('COMPONENTS.APPUPDATE.MESSAGE'),
      this.doAppUpdate.bind(this));
  }

  doAppUpdate() {
    this.updates.activateUpdate().then(() => document.location.reload());
  }
}
