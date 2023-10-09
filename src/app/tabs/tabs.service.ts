import {Injectable, Signal, signal} from '@angular/core';

@Injectable()
export class TabsService<T = unknown> {

  private currentTabInputData = signal<T | null>(null);

  getCurrentTabInputData(): Signal<T | null>{
    return this.currentTabInputData.asReadonly();
  }

  setCurrentTabInputData(inputData: T): void {
    this.currentTabInputData.set(inputData);
  }

}
