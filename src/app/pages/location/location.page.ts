import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { NavigationService, NAVIGATIONPAGES } from 'src/app/services/navigation-service/navigation.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  buscando: boolean;
  latitude: number;
  longitude: number;
  autocompleteService: any;
  placesService: any;
  query = '';
  places: any = [];
  searchDisabled: boolean;
  continueDisabled: boolean;
  location: any;
  map: any;
  constructor(public zone: NgZone, private userManager: UserService, private navigation: NavigationService) {
    this.continueDisabled = true;
   }
  ngOnInit() {
    this.autocompleteService = new google.maps.places.AutocompleteService();

    this.loadMap();
  }



 /* ionViewDidLoad(): void {
   let mapEle: HTMLElement = document.getElementById('map');
    let mapLoaded = this.maps.init(mapEle).then(() => {


        this.searchDisabled = false;

    });

  }*/

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');

    // create LatLng object
    const myLatLng = {lat: 0, lng: 0};

    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 3
    });
    this.placesService = new google.maps.places.PlacesService(this.map);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

  distance(lat1, lon1, lat2, lon2, unit): number {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    } else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') { dist = dist * 1.609344; }
      if (unit == 'N') { dist = dist * 0.8684; }
      return dist;
    }
  }
selectPlace(place) {

    this.places = [];

    const location = {
        lat: null,
        lng: null,
        radius: null,
        name: place.name
    };

    this.placesService.getDetails({placeId: place.place_id}, (details: google.maps.places.PlaceResult) => {

      location.name = details.formatted_address;
      location.lat = details.geometry.location.lat();
      location.lng = details.geometry.location.lng();
      location.radius = this.distance(
        details.geometry.viewport.getNorthEast().lat(),
        details.geometry.viewport.getNorthEast().lng(),
        details.geometry.viewport.getSouthWest().lat(),
        details.geometry.viewport.getSouthWest().lng(), 'K') * 100;
      this.continueDisabled = false;
      this.query = location.name;
      this.map.setCenter({lat: location.lat, lng: location.lng});

      this.location = location;

      this.places = [];

    });

}

searchPlace() {

    this.continueDisabled = true;

    if (this.query.length > 0 && !this.searchDisabled) {

        const config = {
            types: ['geocode'],
            input: this.query
        };
        this.places = [];
        this.buscando = true;
        this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {

                this.places = [];

                predictions.forEach((prediction) => {
                  if ((prediction.types.indexOf('neighborhood') > -1)
                    || (prediction.types.indexOf('sublocality') > -1)
                    || (prediction.types.indexOf('sublocality_level_1') > -1)
                    || (prediction.types.indexOf('locality') > -1)) {
                      this.places.push(prediction);
                    }
                });
                this.buscando = false;
            }

        });

    } else {
        this.places = [];
    }

}
  public continue(): void {
    this.userManager.setLocation(this.location.name, this.location.lat, this.location.lng, this.location.radius);
    this.navigation.setRoot(NAVIGATIONPAGES.AGE);
  }
}
