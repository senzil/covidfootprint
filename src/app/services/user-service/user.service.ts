import { Injectable } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';

// Objects
import { UserProfile } from 'src/app/objects/userProfile';

// Services
import { FirestoreService } from 'src/app/services/firestore-service/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user:UserProfile;
  private userObserver:Subscriber<UserProfile>;

  constructor(
    private firestoreManager:FirestoreService
  ) {
    this.user = null;
    this.userObserver = null;
  }

  public hasUser():boolean{
    return this.user != null;
  }

  public getUser():UserProfile{
    return this.user;
  }

  public get():Observable<UserProfile>{
    return Observable.create((observer:Subscriber<UserProfile>) => {
      this.userObserver = observer;
      if(this.hasUser()){
        this.userObserver.next(this.user);
        this.userObserver.complete();
      }
    });
  }

  public set(user:UserProfile):Promise<boolean>{
    return new Promise<boolean> ((res, rej) => {
      let subscription:Subscription = this.getFirestoreProfile(user).subscribe((userFromFirestore:UserProfile) => {
        subscription.unsubscribe();
        this.user = user;
        if(!userFromFirestore) this.user.save();
        else this.user = userFromFirestore;
        if(this.userObserver){
          this.userObserver.next(this.user);
          this.userObserver.complete();
        }
        res(true);
      });
    });
  }

  private getFirestoreProfile(user:UserProfile):Observable<UserProfile>{
    return Observable.create((observer:Subscriber<UserProfile>) => {
      let subscription:Subscription = this.firestoreManager.getUserProfile(user).subscribe((userFirestore:UserProfile) => {
        subscription.unsubscribe(); 
        observer.next(userFirestore);
        observer.complete();
      });
    });
  }

  public setLocation(name:string, lat:number, lng:number, radius:string):void{
    this.user.setLocationName(name);
    this.user.setLat(lat);
    this.user.setLng(lng);
    this.user.setLocationRadius(radius);
    this.user.save();
  }

  public setBithYear(year:number):void{
    this.user.setBirthYear(year);
    this.user.save();
  }

  public getEmail():string{
    if(!this.user) return null;
    return this.user.getEmail()
  }

  public getUid():string{
    if(!this.user) return null;
    return this.user.getUid()
  }
  public logout():void{
    this.user = null;
  }

  public setFootprint(value: number)
  {
    this.user.setFootprint(value);
    this.user.save();
  }

}
