import { Injectable } from '@angular/core';

// Objects
import { UserProfile } from 'src/app/objects/userProfile';

// Services
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { UserService } from 'src/app/services/user-service/user.service';
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';
import { FirestoreService } from 'src/app/services/firestore-service/firestore.service';

// Angular Fire
import { User, auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private firebaseUser: User;

  constructor(
    private ngFireAuth: AngularFireAuth,
    private loadManager: LoadingService,
    private userManager: UserService,
    private navigation: NavigationService,
    private firestoreManager: FirestoreService,
    private translate: TranslateService
  ) {
    this.initializeSession();
  }

  private async initializeSession(): Promise<void>{
    const loader: HTMLIonLoadingElement = await this.loadManager.simpleMessage(this.translate.instant('COMPONENTS.LOGIN.VERIFYING'));
    this.ngFireAuth.authState.subscribe(async user => {
      if (user) {
        this.firebaseUser = user;
        const succes: boolean = await this.userManager.set(new UserProfile(user, this.firestoreManager));
        if (succes) { this.getFirestoreUser(); }
      } else {
        this.firebaseUser = null;
        this.navigation.setRoot(NAVIGATIONPAGES.LOGIN);
      }
      this.loadManager.dismiss(loader);
    });
  }

  private getFirestoreUser(): void {
    this.userManager.get().subscribe((userProfile: UserProfile) => {
      if (userProfile.getLocationName() == null) {
        this.navigation.setRoot(NAVIGATIONPAGES.LOCATION);
      } else if(userProfile.getBirthYear() == null) {
        this.navigation.setRoot(NAVIGATIONPAGES.AGE);
      } else if(userProfile.getFootprint() == null) {
        this.navigation.setRoot(NAVIGATIONPAGES.WIZARD);
      } else {
        this.navigation.setRoot(NAVIGATIONPAGES.HOME);
      }
    });
  }

  private getUser(): User {
    return this.firebaseUser;
  }

  public isUserLogged(): boolean {
    return this.userManager.hasUser();
  }

  // Sign in with Gmail
  public GoogleAuth(): Promise<boolean> {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Sign in with facebook
  public FacebookAuth(): Promise<boolean> {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

    // Sign in with facebook
    public TwitterAuth(): Promise<boolean> {
      return this.AuthLogin(new auth.TwitterAuthProvider());
    }

  // Auth providers
  private AuthLogin(provider): Promise<boolean> {
    return this.ngFireAuth.auth.signInWithPopup(provider)
      .then((result) => true)
      .catch((error) => false);
  }

  public async logout(): Promise<boolean>{
    const loader: HTMLIonLoadingElement = await this.loadManager.simpleMessage(this.translate.instant('COMPONENTS.LOGIN.CLOSING'));
    return this.ngFireAuth.auth.signOut()
    .then(res => {
      this.navigation.setRoot(NAVIGATIONPAGES.LOGIN);
      this.userManager.logout();
      this.loadManager.dismiss(loader);
      return true;
    }).catch(err => { 
      console.log('Error in logout', err);
      this.loadManager.dismiss(loader);
      return false;
    });
  }
}
