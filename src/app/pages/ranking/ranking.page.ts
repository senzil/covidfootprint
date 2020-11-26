import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore-service/firestore.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
})
export class RankingPage implements OnInit {

  ranking = { best: [], worst: []};

  constructor(private api: FirestoreService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    const self = this;
    this.api.getRanking().then(request => request.subscribe((data: any) => {
      self.ranking = data;
      console.log(self.ranking);
    }));
  }

}
