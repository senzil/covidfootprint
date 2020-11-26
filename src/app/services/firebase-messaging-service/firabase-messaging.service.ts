import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FirebaseMessagingService {

  currentMessage = new BehaviorSubject(null);
  constructor(private angularFireMessaging: AngularFireMessaging, private http: HttpClient) {
    this.angularFireMessaging.messaging.subscribe(
      (messagingInstance) => {
        messagingInstance.onMessage = messagingInstance.onMessage.bind(messagingInstance);
        messagingInstance.onTokenRefresh = messagingInstance.onTokenRefresh.bind(messagingInstance);
        (messagingInstance as any)._next = (payload: any) => {
          console.log(payload);
          this.currentMessage.next(payload.notification || payload.data);
        };
      }
    );
  }

  requestPermission() {
    this.angularFireMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);

          const offset = new Date().getTimezoneOffset();
          this.http.post(
              'https://us-central1-c19footprint.cloudfunctions.net/subscribeToTopic',
              {
                token,
                topic: offset.toString().replace('-', 'e')
              })
              .subscribe((data: any) => console.log('Saving to the server!', data));

          this.http.post(
            'https://us-central1-c19footprint.cloudfunctions.net/subscribeToTopic',
            {
              token,
              topic: 'all'
            })
            .subscribe((data: any) => console.log('Saving to the server!', data));
        },
        (error) => { console.error(error); }
      );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe();
  }
}


