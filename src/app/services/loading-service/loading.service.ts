import { Injectable } from '@angular/core';

// Loading
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(
    private loadingController: LoadingController
  ) { }

  public async simpleMessage(message: string): Promise<HTMLIonLoadingElement> {
    const loadingElement: HTMLIonLoadingElement = await this.loadingController.create({
      message,
      spinner: 'crescent',
    });
    loadingElement.present();
    return loadingElement;
  }

  public dismiss(loadingElement: HTMLIonLoadingElement): Promise<boolean> {
    return loadingElement.dismiss();
  }
}
