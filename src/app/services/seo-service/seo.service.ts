import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(private meta: Meta, private translate: TranslateService) { }

  translateMetaTags() {
    this.meta.updateTag({name: 'description', content: this.translate.instant('PAGES.ABOUT.OBJETIVO')});
    this.meta.updateTag({property: 'og:description', content: this.translate.instant('PAGES.ABOUT.OBJETIVO')});
    this.meta.updateTag({property: 'twitter:description', content: this.translate.instant('PAGES.ABOUT.OBJETIVO')});
  }
}
