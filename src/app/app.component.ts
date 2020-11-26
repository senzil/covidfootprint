import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {} from 'googlemaps';

// Services
import { LoginService } from 'src/app/services/login-service/login.service';
import {FirebaseMessagingService } from './services/firebase-messaging-service/firabase-messaging.service';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from './services/alert-service/alert.service';
import { AppUpdateService } from './services/app-update/app-update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  message: BehaviorSubject<any>;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loginManager: LoginService, // Check session
    private messaging: FirebaseMessagingService,
    private alert: AlertService,
    private appupdate: AppUpdateService // Check updates
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.messaging.requestPermission();
    this.messaging.receiveMessage();
    this.messaging.currentMessage.subscribe(
      payload => {
        if (payload) {
          this.alert.simple(payload.title, payload.body);
        }
      });
   }
}
