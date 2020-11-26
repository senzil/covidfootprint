import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore-service/firestore.service';
import { LoadingService } from '../loading-service/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class FootprintService {

  currentValue: number;
  currentDate: Date;

  constructor(private firestoreManager: FirestoreService, private loadingManager: LoadingService, private translate: TranslateService) { }

  public calcFootprint(responses: Array<Response>): number {
    let value: number;
    value = 0;
    responses.forEach(element => {
      value += element['value'];
    });
    return value;
  }

  public async getFootprint(userId: string, date: Date): Promise<number> {
    const loader: HTMLIonLoadingElement = await this.loadingManager.simpleMessage(this.translate.instant('COMMONS.CARGANDO'));

    return new Promise<number>((resolve, reject) => {
      const a = this.firestoreManager.getResponses(userId, date).subscribe((responses: any) => {
        let value: number;
        let r: Array<Response>;
        value = 0;
        a.unsubscribe();
        r = responses as Array<Response>;
        if (r.length === 0) {
          resolve(-1);
        } else {
          r.forEach(element => {
            value += element['value'];
          });
          resolve(value);
        }
      });
    }).then(value => {
      this.loadingManager.dismiss(loader);
      this.currentValue = value;
      this.currentDate = date;
      return value;
    });
  }

  async getFootprintString(userId: string, date: Date): Promise<string> {
    const value = await this.getFootprint(userId, date);
    return value >= 0 ? value.toString() : 'N/A';
  }

  public today() {
    return this.checkDate(this.currentDate, new Date());
  }

  checkDate(date1: Date, date2: Date): boolean {
    return (date1.getDate() === date2.getDate())
      && (date1.getMonth() === date2.getMonth())
      && (date1.getFullYear() === date2.getFullYear());
  }
}
