import {Component, inject, Input, signal, Signal} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router, RouterModule} from "@angular/router";
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { TabsService } from 'app/tabs/tabs.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-condition-highlight',
  templateUrl: './current-condition-highlight.component.html',
  styleUrls: ['./current-condition-highlight.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CurrentConditionComponent {

  weatherService = inject(WeatherService);
  private router = inject(Router); 
  protected locationService = inject(LocationService);
  private tabsService = inject(TabsService<ConditionsAndZip>);
  @Input() location: Signal<ConditionsAndZip | null> = this.tabsService.getCurrentTabInputData();

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }
}
