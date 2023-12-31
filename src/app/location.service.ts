import { Injectable, Signal, effect, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const LOCATIONS : string = "locations";

export type Location = {
  code: string;
  id: number;
};

@Injectable({providedIn: 'root'})
export class LocationService {
  private static id = 0;

  private readonly locationAdded = new Subject<Location>();
  private readonly locationRemoved = new Subject<Location>();
  private readonly locations = signal<Location[]>(this.getInitialLocations());
  locationAdded$: Observable<Location> = this.locationAdded;
  locationRemoved$: Observable<Location> = this.locationRemoved;

  private _effectStorage = effect(() => {
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations()));
  });

  constructor() {
    const locations = this.locations();
    const lastLocation = locations[locations.length -1];
    if(lastLocation?.id) {
      LocationService.id =  lastLocation?.id + 1; 
    }
  }

  private getInitialLocations(): Location[] {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      const locations = JSON.parse(locString);
      return locations;
    }
    return [];
  }

  getLocations(): Signal<Location[]>{
    return this.locations.asReadonly();
  }

  addLocation(locationCode: string) {
    const locationToAdd = {
      code: locationCode,
      id: LocationService.id++
    };
    this.locations.update((locations) => [...locations, locationToAdd]);
    this.locationAdded.next(locationToAdd);
  }

  removeLocation(locationToRemove: Location) {
    const currentLocations = this.locations();

    let index = currentLocations.indexOf(locationToRemove);
    if (index !== -1){
      currentLocations.splice(index, 1); 
      this.locations.set(currentLocations);
      this.locationRemoved.next(locationToRemove);
    }
  }
}
