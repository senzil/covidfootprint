import { User } from 'firebase/app';
import { FirestoreService } from 'src/app/services/firestore-service/firestore.service';

export class UserProfile {

  private uid: string;
  private email: string;
  private displayName: string;
  private photoURL: string;
  private emailVerified: boolean;
  private birthYear: number;
  private lastUpdate: number;
  private locationName: string;
  private lat: number;
  private lng: number;
  private locationRadius: string;
  private footprint: number;

  constructor(private user: User, private firestoreService: FirestoreService) {
    if (this.user == null) {
      this.nullConstructor();
      return this;
    }
    this.uid = this.user.uid;
    this.email = this.user.email;
    this.displayName = this.user.displayName;
    this.photoURL = this.user.photoURL;
    this.emailVerified = this.user.emailVerified;
    this.birthYear = null;
    this.lastUpdate = null;
    this.locationName = null;
    this.lat = null;
    this.lng = null;
    this.locationRadius = null;
    this.footprint = null;
  }

  private nullConstructor() {
    this.displayName = null;
    this.photoURL = null;
    this.email = null;
    this.uid = null;
    this.birthYear = null;
    this.lastUpdate = null;
    this.firestoreService = null;
    this.locationName = null;
    this.lat = null;
    this.lng = null;
    this.locationRadius = null;
    this.footprint = null;
  }
  
  public save(): Promise<boolean>{
    if(!this.firestoreService) return new Promise<boolean> ((res) => { res(true) });
    this.lastUpdate = Date.now();
    return this.firestoreService.insertUserProfile(this);
  }

  public getUid(): string {
    return this.uid;
  }

  public setId(uid: string): void {
    this.uid = uid;
  }

  public getEmail():string{
    return this.email;
  }

  public setMail(email:string):void{
    this.email = email;
  }

  public getDisplayName():string{
    return this.displayName;
  }

  public setIsplayName(displayName:string):void{
    this.displayName = displayName
  }

  public getPhotoURL():string{
    return this.photoURL;
  }

  public setHotoURL(photoURL:string):void{
    this.photoURL = photoURL;
  }

  public getEmailVerified():boolean{
    return this.emailVerified;
  }

  public setMailVerified(emailVerified:boolean):void{
    this.emailVerified = emailVerified;
  }

  public getBirthYear():number{
    return this.birthYear;
  }

  public setBirthYear(year:number):void{
    this.birthYear = year;
  }

  public getLastUpdate():number{
    return this.lastUpdate;
  }

  public getLocationName():string{
    return this.locationName;
  }

  public setLocationName(locationName: string){
    this.locationName = locationName;
  }

  public getLat():number{
    return this.lat;
  }

  public setLat(lat: number){
    this.lat = lat;
  }

  public getLng():number{
    return this.lng;
  }

  public setLng(lng: number){
    this.lng = lng;    
  }

  public getLocationRadius():string{
    return this.locationRadius;
  }

  public setLocationRadius(locationRadius: string){
    this.locationRadius = locationRadius;    
  }

  public getFootprint():number{
    return this.footprint;
  }

  public setFootprint(footprint: number){
    this.footprint = footprint; 
  }
}