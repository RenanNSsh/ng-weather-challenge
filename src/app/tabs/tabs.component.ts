import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnInit, Output, Signal, SimpleChanges, ViewChild, ViewContainerRef, inject, signal } from '@angular/core';
import { Tab } from './tab.model';
import { CurrentConditions } from 'app/current-conditions/current-conditions.type';
import { CurrentConditionComponent } from 'app/current-condition/current-condition.component';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { TabsService } from './tabs.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: [
    './tabs.component.css'
  ],
  providers: [
    TabsService
  ]
})
export class TabsComponent<T = unknown> implements OnInit{
  @Input() tabs: Tab<T>[] = [];
  @Input() selectedTab = 0;
  @Output() tabRemoved = new EventEmitter<number>();
  @ViewChild('container', { read: ViewContainerRef}) _vcr?: ViewContainerRef;
  private componentRef?: ComponentRef<unknown>;
  private creatingComponent = false;
  private tabsService = inject(TabsService);

  ngOnInit(): void {
    this.createTabComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['tabs']){
      this.tabs = [...changes['tabs'].currentValue];
      this.createTabComponent();
    }
  }


  private async createTabComponent(): Promise<void>{
    const currentTab = this.tabs[this.selectedTab];
    if(this.tabs.length && currentTab && !this.creatingComponent){
      this.creatingComponent = true;
      if(this.componentRef) {
        this.componentRef.destroy()
        this._vcr?.clear();
      }
      /*  You can customize the tab with any component
       *  so you can have one tab different than other
       */ 
      const component = await currentTab.component();
      this.componentRef = this._vcr?.createComponent(component);
      if(this.componentRef) {
        this.tabsService.setCurrentTabInputData(currentTab.inputData);
      }
      this.creatingComponent = false;
    }
  }

  closeTab(tabIndex: number): void {
    this.tabs.splice(tabIndex, 1);
    if(tabIndex < this.selectedTab) {
      this.selectedTab--;
    } 
    if(tabIndex === this.selectedTab) {
      this.selectTab(Math.max(this.selectedTab - 1, 0));
    }
    this.tabRemoved.next(tabIndex);

  }

  selectTab(tabIndex: number): void {
    this.selectedTab = tabIndex;
    this.createTabComponent();
  }
}
