import { Component, OnInit, AfterViewChecked, Inject, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import packageJson from '../../../../package.json';
import { SEOService } from 'src/app/services/seo-service/seo.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, AfterViewChecked {

  public abrirselectorlenguaje = !localStorage.getItem('lang');
  public darkmode = false;

  constructor(
    private navigation: NavigationService,
    public loginService: LoginService,
    private menu: MenuController,
    private translate: TranslateService,
    private seo: SEOService,
    @Inject(DOCUMENT) private document: Document) {

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.darkmode = prefersDark.matches;
    try {
      prefersDark.addEventListener<'change'>('change', (mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
    } catch (error) {
      // tslint:disable-next-line: deprecation
      prefersDark.addListener((mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
    }
  }

  toggleDarkTheme(shouldAdd: boolean) {
    document.body.classList.toggle('dark', shouldAdd || this.darkmode);
  }

  ngAfterViewChecked(): void {
    localStorage.setItem('lang', this.translate.currentLang);
  }

  ngOnInit() { }

  currentLanguage() {
    return this.translate.currentLang;
  }

  currentVersion() {
    return 'v' + packageJson.version;
  }

  changeLanguage(event: any) {
    const lang = event.target.value;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.seo.translateMetaTags();
  }

  saveCurrentLanguage(event: any) {
    localStorage.setItem('lang', event.target.value);
  }

  toogleMain() {
    this.menu.enable(true, 'main');
    this.menu.toggle('main');
  }

  goMap() {
    this.navigation.setRoot(NAVIGATIONPAGES.MAP);
  }

  goHome() {
    this.navigation.setRoot(NAVIGATIONPAGES.HOME);
  }

  goAbout() {
    this.navigation.setRoot(NAVIGATIONPAGES.ABOUT);
  }

  goSources() {
    this.navigation.setRoot(NAVIGATIONPAGES.SOURCES);
  }

  goRanking() {
    this.navigation.setRoot(NAVIGATIONPAGES.RANKING);
  }

  goData() {
    this.navigation.setRoot(NAVIGATIONPAGES.DATA);
  }

  goLogin() {
    this.navigation.setRoot(NAVIGATIONPAGES.LOGIN);
  }
}
