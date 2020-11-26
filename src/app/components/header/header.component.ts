import { Component, OnInit } from '@angular/core';
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';
import { LoginService } from 'src/app/services/login-service/login.service';
import { MenuComponent } from '../menu/menu.component';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(
    private navigation: NavigationService,
    public loginService: LoginService,
    private menu: MenuComponent) { }

  ngOnInit() {}

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

  goLogin() {
    this.navigation.setRoot(NAVIGATIONPAGES.LOGIN);
  }

  toogleMenu() {
    this.menu.toogleMain();
  }
}
