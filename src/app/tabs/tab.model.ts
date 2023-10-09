import { Observable, Subject } from "rxjs";

export interface Tab<T>{
    name: string;
    component: () => Promise<any>;
    inputData: T;
}