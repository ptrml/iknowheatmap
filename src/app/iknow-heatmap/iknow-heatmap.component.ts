import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { Usage } from '../shared/data';
import {RGBColor} from "d3-color";
import {DataService} from "../services/data.service";
import {Heatmap} from "../shared/heatmap";
import {Data} from "@angular/router";
import {HeatmapDayWeek} from "../shared/heatmapDayWeek";
import {HeatmapHourDay} from "../shared/heatmapHourDay";

@Component({
  selector: 'app-iknow-heatmap',
  templateUrl: './iknow-heatmap.component.html',
  styleUrls: ['./iknow-heatmap.component.css']
})
export class IknowHeatmapComponent implements OnInit {

  private x: any;
  private y: any;
  private g: any;
  private selectedYear = 2016;

  private overviewMap: HeatmapDayWeek;
  private detailedMap: HeatmapHourDay;




  //private margin = { top: 20, right: 20, bottom: 110, left: 40 };

  private dataService:DataService;

  constructor(private _dataService:DataService) { this.dataService = _dataService;}

  ngOnInit() {
    this.render();
  }

  private render()
  {
    this.loadOverviewData(this.selectedYear);
  }


  private initOverviewSvg() {
    const context = this;
    let margin = {top: 40, right: 0, bottom: 0, left: 20};
    this.overviewMap = new HeatmapDayWeek('overview',115,570,margin,function (from:number,to:number) {
      context.loadDetailedData(from,to,context.selectedYear);
    });
    //let margin = {top: 200, right: 40, bottom: 200, left: 40};
    let margin2 = {top: 0, right: 0, bottom: 60, left: 30};
    this.detailedMap = new HeatmapHourDay('detailed',320,920,margin2);
    this.detailedMap.gridSize = 35;
  }

  private loadOverviewData(year:number) {

    const context = this;

    d3.tsv("assets/data.tsv", function(error, data) {
      if (error) {
        throw error;
      }

      let formattedData:Usage[] = [];

      for(const d of data.filter(function(d){if(Number(d["ga:year"])===year)return d;}))
      {
        const usage = new Usage();
        const tempdate:string = d["ga:date"];
        usage.dow = Number(d["ga:dayOfWeek"]);
        usage.year = Number(d["ga:year"]);
        usage.week = Number(d["ga:week"]);
        usage.views = Number(d["ga:pageviews"]);
        usage.date = new Date(Number(tempdate.substr(0,4)),Number(tempdate.substr(4,2))-1,Number(tempdate.substr(6,2)));
        usage.label = (d["ga:date"]);

        //if(usage.year===year)
        formattedData.push(usage);
      }



      context.initOverviewSvg();
      context.overviewMap.draw(formattedData);

    });
  }

  private loadDetailedData(startingWeek:number,endingWeek:number,year:number) {
    const context = this;

    d3.tsv("assets/data2.tsv", function(error, data) {
      if (error) {
        throw error;
      }

      let formattedData:Usage[] = [];

      for(const d of data
        .filter(function(d){
          let week = Number(d["ga:week"]);
          if(Number(d["ga:year"])===year && week<endingWeek && week>=startingWeek)
            return d;
      }))
      {
        const usage = new Usage();
        const tempdate:string = d["ga:date"];
        usage.dow = Number(d["ga:dayOfWeek"]);
        usage.year = Number(d["ga:year"]);
        usage.week = Number(d["ga:week"]);
        usage.hour = Number(d["ga:hour"]);
        usage.views = Number(d["ga:pageviews"]);
        usage.date = new Date(Number(tempdate.substr(0,4)),Number(tempdate.substr(4,2))-1,Number(tempdate.substr(6,2)));
        usage.label = (d["ga:date"]);

        //if(usage.year===year)
        formattedData.push(usage);
      }

      context.detailedMap.draw(formattedData);



    });
  }









  private drawBars() {

    /*


     d3.tsv("data1.tsv",
     function(d) {
     return {
     day: +d.dow,
     hour: +d.hour,
     value: +d.value
     };
     },
     function(error, data) {
     let colorScale = d3.scale.quantile()
     .domain([0, this.buckets - 1, d3.max(data, function (d) { return d.value; })])
     .range(this.colors);

     let cards = this.svg.selectAll(".hour")
     .data(data, function(d) {return d.dow+':'+d.hour;});

     cards.append("title");

     cards.enter().append("rect")
     .attr("x", function(d) { return (d.hour - 1) * this.gridSize; })
     .attr("y", function(d) { return (d.dow - 1) * this.gridSize; })
     .attr("rx", 4)
     .attr("ry", 4)
     .attr("class", "hour bordered")
     .attr("width", this.gridSize)
     .attr("height", this.gridSize)
     .style("fill", this.colors[0]);

     cards.transition().duration(1000)
     .style("fill", function(d) { return colorScale(d.value); });

     cards.select("title").text(function(d) { return d.value; });

     cards.exit().remove();

     let legend = this.svg.selectAll(".legend")
     .data([0].concat(colorScale.quantiles()), function(d) { return d; });

     legend.enter().append("g")
     .attr("class", "legend");

     legend.append("rect")
     .attr("x", function(d, i) { return this.legendElementWidth * i; })
     .attr("y", this.height)
     .attr("width", this.legendElementWidth)
     .attr("height", this.gridSize / 2)
     .style("fill", function(d, i) { return this.colors[i]; });

     legend.append("text")
     .attr("class", "mono")
     .text(function(d) { return "≥ " + Math.round(d); })
     .attr("x", function(d, i) { return this.legendElementWidth * i; })
     .attr("y", this.height + this.gridSize);

     legend.exit().remove();

     });*/
  }
/*

  private blar() {
    let margin = {top: 200, right: 40, bottom: 200, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    let x = d3.scaleTime()
      .domain([new Date(2013, 7, 1), new Date(2013, 7, 15)])
      .rangeRound([0, width]);

    let svg = d3.select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "axis axis--grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .ticks(d3.timeHour, 12)
        .tickSize(-height)
        .tickFormat(function() { return null; }))
      .selectAll(".tick")
    //.classed("tick--minor", function(d) { return d.getHours; });

    svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .ticks(d3.timeDay)
        .tickPadding(0))
      .attr("text-anchor", null)
      .selectAll("text")
      .attr("x", 6);

    svg.append("g")
      .attr("class", "brush")
      .call(d3.brushX()
        .extent([[0, 0], [width, height]])
        .on("end", brushended));

    function brushended() {
      if (!d3.event.sourceEvent) return; // Only transition after input.
      if (!d3.event.selection) return; // Ignore empty selections.
      let d0 = d3.event.selection.map(x.invert);
      let d1 = d0.map(d3.timeDay.round);
      console.log(d3.event.selection);
      console.log(d0);
      console.log(d1);

      // If empty when rounded, use floor & ceil instead.
      if (d1[0] >= d1[1]) {
        d1[0] = d3.timeDay.floor(d0[0]);
        d1[1] = d3.timeDay.offset(d1[0]);
      }

      d3.select(this).transition().call(d3.event.target.move, d1.map(x));
    }
  }
*/

}
