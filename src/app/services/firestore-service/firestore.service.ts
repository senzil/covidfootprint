import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { environment } from '../../../environments/environment';

// Firestore
import { AngularFirestore } from '@angular/fire/firestore';

// Objects
import { UserProfile } from 'src/app/objects/userProfile';
import { Response } from 'src/app/objects/response';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// Consts - Indexs
const INDEX_USERS = 'users';
const INDEX_RESPONSES = 'responses';

// Consts - Columns - Users
const COLUMN_NAME_USER_UID = 'uid';
const COLUMN_NAME_USER_BIRTHYEAR = 'birthYear';
const COLUMN_NAME_USER_LASTUPDATE = 'lastUpdate';
const COLUMN_NAME_USER_LOCATIONNAME = 'locationName';
const COLUMN_NAME_USER_LAT = 'lat';
const COLUMN_NAME_USER_LNG = 'lng';
const COLUMN_NAME_USER_LOCATIONRADIUS = 'locationRadius';
const COLUMN_NAME_USER_FOOTPRINT = 'footprint';

// Consts - Columns - Responses
const COLUMN_NAME_RESPONSE_ANSWER = 'answer';
const COLUMN_NAME_RESPONSE_VALUE = 'value';
const COLUMN_NAME_RESPONSE_USER_UID = 'userUid';
const COLUMN_NAME_RESPONSE_DATE = 'responseDate';
const COLUMN_ID = 'idResponse';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  public mapUrl = environment.firestoreMapUrl
  constructor(
    private firestore: AngularFirestore,
    private ngFireAuth: AngularFireAuth,
    private http: HttpClient
  ) {
    this.getMapURL();
  }

  // Private Methods

  private insertFirestore(collection: string, record: any, id: string= null): Promise<any> {
    if (!id) { return this.firestore.collection(collection).add(Object.assign({}, record)); }
    return this.firestore.collection(collection).doc(id).set(Object.assign({}, record));
  }

  private readFirestore(collection: string): Observable<any> {
    return this.firestore.collection(collection).snapshotChanges();
  }

  private getFirestore(collection: string, id: string): Observable<any> {
    return this.firestore.doc(collection + '/' + id).get();
  }

  private deleteFirestore(collection: string, id: string): Promise<void> {
    return this.firestore.collection(collection).doc(id).delete();
  }

  // Public Methods

  public insertUserProfile(userProfile: UserProfile): Promise<boolean> {
    const obj = {};
    obj[COLUMN_NAME_USER_UID] = userProfile.getUid();
    obj[COLUMN_NAME_USER_BIRTHYEAR] = userProfile.getBirthYear();
    obj[COLUMN_NAME_USER_LASTUPDATE] = userProfile.getLastUpdate();
    obj[COLUMN_NAME_USER_LOCATIONNAME] = userProfile.getLocationName();
    obj[COLUMN_NAME_USER_LAT] = userProfile.getLat();
    obj[COLUMN_NAME_USER_LNG] = userProfile.getLng();
    obj[COLUMN_NAME_USER_LOCATIONRADIUS] = userProfile.getLocationRadius();
    obj[COLUMN_NAME_USER_FOOTPRINT] = userProfile.getFootprint();
    return this.insertFirestore(INDEX_USERS, obj, userProfile.getUid())
      .then(() => true)
      .catch((err) => { console.log('Error Firestore insert user', err); return false; });
  }

  public getUserProfile(userProfile: UserProfile): Observable<UserProfile> {
    return Observable.create((observer: Subscriber<any>) => {
      return this.firestore.collection(INDEX_USERS, ref => {
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.where(COLUMN_NAME_USER_UID, '==', userProfile.getUid()).limit(1);
        return query;
      }).snapshotChanges().subscribe((data) => {
        if (data.length === 0) {
          observer.next(null);
          observer.complete();
          return;
        }

        userProfile.setBirthYear(data[0].payload.doc.data()[COLUMN_NAME_USER_BIRTHYEAR]);
        userProfile.setLocationName(data[0].payload.doc.data()[COLUMN_NAME_USER_LOCATIONNAME]);
        userProfile.setLat(data[0].payload.doc.data()[COLUMN_NAME_USER_LAT]);
        userProfile.setLng(data[0].payload.doc.data()[COLUMN_NAME_USER_LNG]);
        userProfile.setLocationRadius(data[0].payload.doc.data()[COLUMN_NAME_USER_LOCATIONRADIUS]);
        userProfile.setFootprint(data[0].payload.doc.data()[COLUMN_NAME_USER_FOOTPRINT]);
        observer.next(userProfile);
        observer.complete();
      });
    });
  }


  public getMapURL() {
    /* this.firestore.collection('geojson').doc('url').get().subscribe(doc => {
        this.mapUrl = doc.data().url;
      }); */
  }

  private insertResponse(response: Array<Response>, responseObj, userUid: string, date: Date): Promise<boolean> {
      return this.insertFirestore(INDEX_RESPONSES, responseObj, this.getResponseId(userUid, date))
        .then(() => true)
        .catch((err) => { console.log('Error Firestore insert response', err); return false; });
  }

  private getResponseId(userUid: string, date: Date): string {
    return  userUid +
            date.getDate() +
            date.getMonth() +
            date.getFullYear();
  }

  public insertResponses(responses: Array<Response>, user: UserProfile, date: Date, footprint: number): void {
    const responsesObj = {};
    responsesObj[INDEX_RESPONSES] = [];
    responsesObj[COLUMN_ID] = this.getResponseId(user.getUid(), date);
    responsesObj[COLUMN_NAME_USER_BIRTHYEAR] = user.getBirthYear();
    responsesObj[COLUMN_NAME_USER_LOCATIONNAME] = user.getLocationName();
    responsesObj[COLUMN_NAME_USER_LAT] = user.getLat();
    responsesObj[COLUMN_NAME_USER_LNG] = user.getLng();
    responsesObj[COLUMN_NAME_USER_LOCATIONRADIUS] = user.getLocationRadius();
    responsesObj[COLUMN_NAME_RESPONSE_USER_UID] = user.getUid() ? user.getUid() : null;
    responsesObj[COLUMN_NAME_RESPONSE_DATE] = date ? date.toString() : null;
    responsesObj[COLUMN_NAME_USER_FOOTPRINT] = footprint;
    for (const response of responses) {
      const obj = {};
      obj[COLUMN_NAME_RESPONSE_ANSWER] = response.getAnswer() ? response.getAnswer() : null;
      obj[COLUMN_NAME_RESPONSE_VALUE] = response.getValue() === undefined ? null : response.getValue();      
      responsesObj[INDEX_RESPONSES].push(obj);
    }
    this.insertResponse(responses, responsesObj, user.getUid(), date);
  }

  public getResponses(userUid: string, date: Date): Observable<Array<Response>> {
    return new Observable((observer: Subscriber<Array<Response>>) => {
      return this.firestore.collection(INDEX_RESPONSES, ref => {
        let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
        query = query.where(COLUMN_ID, '==', this.getResponseId(userUid, date)).limit(1);
        return query;
      }).snapshotChanges().subscribe((data) => {
        if (data.length === 0) {
          observer.next(new Array<Response>());
          observer.complete();
          return;
        }
        const responses = new Array<Response> ();
        for (const responseObj of data[0].payload.doc.data()[INDEX_RESPONSES]) {
          responses.push(new Response(responseObj[COLUMN_NAME_RESPONSE_ANSWER], responseObj[COLUMN_NAME_RESPONSE_VALUE]));
        }
        observer.next(responses);
        observer.complete();
      });
    });
  }

  public async getRanking() {
    return this.authenticatedRequest('/api/ranking', {});
  }

  private async authenticatedRequest(url: string, body: any) {
    if (!this.ngFireAuth.auth.currentUser) {
      throw new Error('Not authenticated. Make sure you\'re signed in!');
    }

    // Get the Firebase auth token to authenticate the request
    return await this.ngFireAuth.auth.currentUser.getIdToken().then(token => {

      const headers = new HttpHeaders({ Authorization: 'Bearer ' + token });

      return this.http.post(
        ' https://us-central1-c19footprint.cloudfunctions.net' + url,
        body,
        { headers }
      );
    });
  }
}
