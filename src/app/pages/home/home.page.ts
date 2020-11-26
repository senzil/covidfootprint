import { Component } from '@angular/core';

// Objects
import { Response } from 'src/app/objects/response';

// Services
import { FirestoreService } from 'src/app/services/firestore-service/firestore.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';
import { FootprintService } from 'src/app/services/footprint-service/footprint.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  value: number;
  result: string;
  valuedate: Date;
  todayValue: number;
  constructor(
    private firestoreManager: FirestoreService,
    private userManager: UserService,
    private loadingManager: LoadingService,
    private navigation: NavigationService,
    private footprintManager: FootprintService,
    private translate: TranslateService
  ) {
    if (!userManager.hasUser()) {
      this.navigation.setRoot(NAVIGATIONPAGES.LOGIN);
    }
    this.valuedate = new Date();
  }

  ionViewDidEnter() {
    this.getRecords();
    this.getTodayRecords();
  }

  public getCurrentDateLocale() {

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return this.valuedate.toLocaleDateString(this.translate.currentLang, options);
  }

  public past(): void {

  }

  prevDate() {
    this.valuedate.setDate(this.valuedate.getDate() - 1);
    this.getRecords();
  }

  nextDate() {
    if (this.today()) { return; }
    this.valuedate.setDate(this.valuedate.getDate() + 1);
    this.getRecords();
  }

  today() {
    return this.checkDate(this.valuedate, new Date());
  }

  checkDate(date1: Date, date2: Date): boolean {
    return (date1.getDate() === date2.getDate())
      && (date1.getMonth() === date2.getMonth())
      && (date1.getFullYear() === date2.getFullYear());
  }

  private async getRecords() {
    this.result = await this.footprintManager.getFootprintString(this.userManager.getUid(), this.valuedate);
  }

  private async getTodayRecords() {
    this.todayValue =  await this.footprintManager.getFootprint(this.userManager.getUid(), new Date());
  }

  goWizard() {
    this.navigation.setRoot(NAVIGATIONPAGES.WIZARD);
  }

}
