import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// AngularFire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { HeaderComponent } from './components/header/header.component';
import { MenuComponent } from './components/menu/menu.component';
import {FirebaseMessagingService } from './services/firebase-messaging-service/firabase-messaging.service';


// Translation
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LOCATION_INITIALIZED, AsyncPipe } from '@angular/common';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService, injector: Injector, seo: SEOService) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const lang = localStorage.getItem('lang');
      translate.addLangs(['ar', 'de', 'en', 'es', 'fa', 'fr', 'hi', 'it', 'ko', 'nl', 'no', 'pt', 'ru', 'zh']);
      translate.setDefaultLang('es');
      console.log(translate.getBrowserLang());
      translate.use(lang ? lang : translate.getBrowserLang()).subscribe(() => {
        console.log(`Successfully initialized language.'`);
        seo.translateMetaTags();
      }, err => {
        console.error(`Problem with language initialization.'`);
      }, () => {
        resolve(null);
      });
    });
  });
}

// sharing
import { ShareModule, ShareButtonsConfig, SHARE_BUTTONS_CONFIG, ShareDirective } from '@ngx-share/core';
import { Platform } from '@angular/cdk/platform';
import { SEOService } from './services/seo-service/seo.service';

const customShareConfig: ShareButtonsConfig = {
  include: ['facebook',
    'twitter',
    'linkedin',
    'tumblr',
    'pinterest',
    'reddit',
    'telegram',
    'whatsapp',
    'sms',
    'email',
    'copy'],
  exclude: [
    'google',
    'mix',
    'vk',
    'messenger',
    'xing',
    'line',
    'print'],
  twitterAccount: 'senzil'
};

import { AppUpdateService } from './services/app-update/app-update.service';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, HeaderComponent, MenuComponent, FooterComponent],
  entryComponents: [HeaderComponent, MenuComponent, FooterComponent],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
         provide: TranslateLoader,
         useFactory: createTranslateLoader,
         deps: [HttpClient]
      }
    }),
    ShareModule.withConfig(customShareConfig),
    FormsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector, SEOService],
      multi: true
    },
    StatusBar,
    SplashScreen,
    AngularFirestoreModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    MenuComponent,
    FirebaseMessagingService,
    AsyncPipe,
    AppUpdateService,
    Platform,
    {
      provide: SHARE_BUTTONS_CONFIG,
      useValue: customShareConfig
    }
  ],
  bootstrap: [AppComponent, HeaderComponent]
})
export class AppModule {}
