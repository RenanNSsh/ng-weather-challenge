import {CurrentConditions} from './current-conditions/current-conditions.type';
import { Location } from './location.service';

export interface ConditionsAndZip {
    location: Location;
    data: CurrentConditions;
}
