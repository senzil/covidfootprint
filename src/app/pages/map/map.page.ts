import { Component, OnInit } from '@angular/core';
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';
import { ModalController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore-service/firestore.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  map: any;
  minmax = { min: 0, max: 20 };
  filter: { lower: number, upper: number };

  constructor(private navigation: NavigationService, public modalController: ModalController, public firebaseManager: FirestoreService) {
   }

  ngOnInit() {
    this.loadMap();
  }

  calculateColor(avg: number) {
    const red = this.minmax.max !== this.minmax.min ? 255 * (avg - this.minmax.min) / (this.minmax.max - this.minmax.min) : 0;
    const green = this.minmax.max !== this.minmax.min ?  255 - 255 * (avg - this.minmax.min) / (this.minmax.max - this.minmax.min) : 255;
    return 'rgb(' + red + ', ' + green + ' , 0)';
  }

  calculateVisibility(avg: number) {
    console.log(avg, this.filter , avg >= this.filter.lower && avg <= this.filter.upper);

    return avg >= this.filter.lower && avg <= this.filter.upper;
  }

  setStyleAndFilter() {
    this.map.data.setStyle(feature => {
      const avgFootprint = feature.getProperty('avgFootprint');
      const fillColor = this.calculateColor(avgFootprint);
      const visible = this.calculateVisibility(avgFootprint);
      return {
        fillColor,
        strokeWeight: 1,
        visible
      };
    });
    return true;
  }


  loadMap() {


    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');


    // create LatLng object
    let myLatLng = { lat: 0, lng: 0 };

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 3
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        myLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(myLatLng);
      });

      navigator.geolocation.watchPosition(function(position) {
        myLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.map.setCenter(myLatLng);
      });
    }

    this.map.data.loadGeoJson(this.firebaseManager.mapUrl, {}, features => {
      this.minmax = features
        .map(f => f.j.avgFootprint)
        .reduce((a: { min: number; max: number; }, b: number) => {
          if (b < a.min) { a.min = b; }
          if (b > a.max) { a.max = b; }
          return a;
        }, { min: 1000, max: 0 });

      if (!this.filter) {
        this.filter = {
          lower: this.minmax.min,
          upper: this.minmax.max
        };
      }

      this.setStyleAndFilter();
    });

    const infoWindow = new google.maps.InfoWindow({
      content: ''
    });

    this.map.data.addListener('click', function(event) {
      // show an infowindow on click
      infoWindow.setContent(
        '<div style="line-height:1.35;overflow:hidden;white-space:nowrap;" class="infowindow"> '
        + event.feature.getProperty('locationName') + '<br/>Covid 19 Footprint = '
        + parseFloat(event.feature.getProperty('avgFootprint')).toFixed(2) + '</div>');
      const anchor = new google.maps.MVCObject();
      anchor.set('position', event.latLng);
      infoWindow.open(this.map, anchor);
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

  goHome() {
    this.navigation.setRoot(NAVIGATIONPAGES.HOME);
  }
}
