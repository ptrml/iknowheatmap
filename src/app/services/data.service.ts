import { Injectable } from '@angular/core';
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';
import {Usage} from "../shared/data";
import * as d3 from 'd3';


@Injectable()
export class DataService {

  constructor(public http:Http) { }

  public getData() {
    return this.http.get("url").map(t=> t.json());
  }
/*
  public getData() {

    const context = this;

    d3.tsv("assets/data.tsv", function(error, data) {
      if (error) {
        throw error;
      }

      let freshdata:Usage[] = [];

      for(let d of data)
      {
        let usage = new Usage();
        let tempdate:string = d["ga:date"];
        usage.dow = Number(d["ga:dayOfWeek"]);
        usage.year = Number(d["ga:year"]);
        usage.week = Number(d["ga:nthWeek"]);
        usage.views = Number(d["ga:pageviews"]);
        usage.date = new Date(Number(tempdate.substr(0,4)),Number(tempdate.substr(4,2))-1,Number(tempdate.substr(6,2)));
        usage.label = (d["ga:date"]);

        if(usage.year===2016)
          freshdata.push(usage);
      }


      context.minweek = d3.min(freshdata, function (d) { return d.week; });

      context.initSvg();
      context.drawHeat(STATISTICS);

    });
  }*/

}
