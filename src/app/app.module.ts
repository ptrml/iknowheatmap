import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IknowHeatmapComponent } from './iknow-heatmap/iknow-heatmap.component';
import {HttpModule} from '@angular/http';
import {GoogleApiModule} from "ng-gapi";

import {DataService } from './services/data.service';


let gapiConfig = {
  clientId: "CLIENT_ID",
  discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
  scope: [
    "https://www.googleapis.com/auth/analytics.readonly",
    "https://www.googleapis.com/auth/analytics"
  ].join(" ")
};

@NgModule({
  declarations: [
    AppComponent,
    IknowHeatmapComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule { }
