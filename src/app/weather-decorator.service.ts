import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { LocationService } from './location.service';
import { WeatherService } from './weather.service';

@Injectable()
export class WeatherDecoratorService extends WeatherService{

  constructor(protected http: HttpClient, locationStateService: LocationService) { 
    super(http);
    const locations = locationStateService.getLocations();
    locations().forEach(location => {
      super.addCurrentConditions(location);
    });
    locationStateService.locationAdded$.subscribe((location) => {
      this.addCurrentConditions(location);
    });
    locationStateService.locationRemoved$.subscribe((location) => {
      this.removeCurrentConditions(location);
    });
  }

}
