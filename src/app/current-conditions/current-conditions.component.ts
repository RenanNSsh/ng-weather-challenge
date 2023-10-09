import {Component, computed, inject, signal, Signal} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import { Tab } from 'app/tabs/tab.model';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();  
  protected tabs = computed<Tab<ConditionsAndZip>[]>(() => {
    /* If lazy load is not needed then you can directly call the component class here
     * ex: CurrentConditionComponent and you need to add the standalone component
     * in the imports array of AppModule
     */
    return this.currentConditionsByZip().map<Tab<ConditionsAndZip>>((location, index) => {
      //This condition is just for example utilizing different templates.
      if(index === 1) { 
        return {
          component: () => this.getLazyLoadComponentHighlight(), 
          inputData: location,
          name: location.data.name
        }
      }
      return {
        component: () => this.getLazyLoadComponent(), 
        inputData: location,
        name: location.data.name
      }
    })
  
  });
  

  async getLazyLoadComponent(): Promise<any> {
    const {CurrentConditionComponent} = await import('../current-condition/current-condition.component');
    return CurrentConditionComponent;
  }

  async getLazyLoadComponentHighlight(): Promise<any> {
    const {CurrentConditionComponent} = await import('../current-condition-highlight/current-condition-highlight.component');
    return CurrentConditionComponent;
  }
  
  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(tabIndex: number){
    const tabs = this.tabs();
    const tabToRemove = tabs[tabIndex]; 
    this.locationService.removeLocation(tabToRemove.inputData.location);
  }
}
