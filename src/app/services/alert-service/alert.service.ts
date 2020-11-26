import { Injectable } from '@angular/core';

// AlertController
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  public async simple(header: string, message: string, buttons: Array<string>= null): Promise<HTMLIonAlertElement> {
    let buttonsFinal: Array<string>;
    if (!buttons) {
      buttonsFinal = [this.translate.instant('COMMONS.ACEPTAR')];
    } else {
      buttonsFinal = buttons;
    }
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header,
      message,
      buttons: buttonsFinal
    });
    await alert.present();
    return alert;
  }

  public async simpleWithAction(header: string, message: string, action): Promise<HTMLIonAlertElement> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header,
      message,
      buttons: [{
      text: this.translate.instant('COMMONS.ACEPTAR'),
        handler: () => { if (action) { action(); } }
      }]
    });
    await alert.present();
    return alert;
  }

  public async confirm(header: string, message: string, action): Promise<HTMLIonAlertElement> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: this.translate.instant('COMMONS.CANCELAR'),
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: this.translate.instant('COMMONS.ACEPTAR'),
          handler: () => { if (action) { action(); } }
        }
      ]
    });
    await alert.present();
    return alert;
  }

  public async dichotomy(header: string, message: string, actionYes, actionNo): Promise<HTMLIonAlertElement> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: this.translate.instant('COMMONS.NO'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { if (actionNo) { actionNo(); } }
        }, {
          text: this.translate.instant('COMMONS.YES'),
          handler: () => { if (actionYes) { actionYes(); } }
        }
      ]
    });
    await alert.present();
    return alert;
  }

}
