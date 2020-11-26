import { Injectable } from '@angular/core';

// NavController
import { NavController } from '@ionic/angular';

// Router
import { Router, NavigationExtras } from '@angular/router';

// Consts - Pages
const DIR_HOME_PAGE = 'home';
const DIR_LOGIN_PAGE = 'login';
const DIR_LOCATION_PAGE = 'location';
const DIR_AGE_PAGE = 'age';
const DIR_WIZARD_PAGE = 'wizard';
const DIR_MAP_PAGE = 'map';
const DIR_ABOUT_PAGE = 'about';
const DIR_SOURCES_PAGE = 'sources';
const DIR_RANKING_PAGE = 'ranking';
const DIR_DATA_PAGE = 'data';

export const NAVIGATIONPAGES = {
  HOME: DIR_HOME_PAGE,
  LOGIN: DIR_LOGIN_PAGE,
  LOCATION: DIR_LOCATION_PAGE,
  AGE: DIR_AGE_PAGE,
  WIZARD: DIR_WIZARD_PAGE,
  MAP: DIR_MAP_PAGE,
  ABOUT: DIR_ABOUT_PAGE,
  SOURCES: DIR_SOURCES_PAGE,
  RANKING: DIR_RANKING_PAGE,
  DATA: DIR_DATA_PAGE
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private navCtrl: NavController,
    private router: Router
  ) { }

  // Navega a la pagina indicada, agregandola al stack de vistas
  // Ejemplo: navigation.navigate('home');
  public navigate(page: string, navigationExtrasJson: any = null): Promise<boolean> {
    if (!navigationExtrasJson) { return this.router.navigate([page]); }
    const navigationExtras: NavigationExtras = { state: navigationExtrasJson };
    return this.router.navigate([page], navigationExtras);
  }

  // Navega a la pagina indicada, poniendola como pagina root
  // No hay ninguna debajo de esta en el stack de vistas
  // Ejemplo1: navigation.setRoot('home');
  // Ejemplo2: navigation.setRoot('/home');
  public setRoot(page: string): Promise<boolean> {
    const finalPage = page.charAt(0) === '/' ? page : '/' + page;
    return this.navCtrl.navigateRoot(finalPage);
  }
}
