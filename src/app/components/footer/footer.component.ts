import { Component, OnInit } from '@angular/core';
import { FootprintService } from 'src/app/services/footprint-service/footprint.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private footprint: FootprintService, private translate: TranslateService) {}

  ngOnInit() { }

  getCustomShare() {
    if (this.footprint.currentValue > -1 && this.footprint.today()) {
      return this.translate.instant('COMPONENTS.SHARE.FOOTPRINT')
        + ': ' + this.footprint.currentValue
        + ' - ' + this.translate.instant('PAGES.ABOUT.OBJETIVO')
        + ' #coronavirus #covi19 #c19footprint';
    }

    return this.translate.instant('PAGES.ABOUT.OBJETIVO');
  }
}
