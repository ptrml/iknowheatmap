import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';

import { STATISTICS,Usage } from '../shared/data';
import {RGBColor} from "d3-color";
import {DataService} from "../services/data.service";
import {Data} from "@angular/router";

@Component({
  selector: 'app-iknow-heatmap',
  templateUrl: './iknow-heatmap.component.html',
  styleUrls: ['./iknow-heatmap.component.css']
})
export class IknowHeatmapComponent implements OnInit {

  private x: any;
  private y: any;
  private svg: any;
  private g: any;
  private scaleDay: any;
  private scaleWeek: any;
  private color: any;
  private minweek: number;


  //private margin = { top: 20, right: 20, bottom: 110, left: 40 };
  private margin = {top: 200, right: 40, bottom: 200, left: 40};
  private width = 760 - this.margin.left - this.margin.right;
  private height = 500 - this.margin.top - this.margin.bottom;

  private weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",""];

  private dataService:DataService;

  constructor(private _dataService:DataService) { this.dataService = _dataService;}
  ngOnInit() {
    this.loadData();
      //this.initSvg();
      this.drawBars();
      //this.blar();
  }


  private brush(){
    let brush = d3.brushX()
      .extent([[this.scaleWeek.range()[0], this.scaleDay.range()[0]], [this.scaleWeek.range()[1], this.scaleDay.range()[1]]])
      //.extent([[0, 0], [300, 300]])
      .on("end",this.brushed);
    let slider = this.svg.append("g").attr("class", "brush").call(brush);
  }

  private loadData() {

    const context = this;

    d3.tsv("assets/data.tsv", function(error, data) {
      if (error) {
        throw error;
      }

      for(let d of data)
      {
        let usage = new Usage();
        let tempdate:string = d["ga:date"];
        usage.dow = Number(d["ga:dayOfWeek"]);
        usage.year = Number(d["ga:year"]);
        usage.week = Number(d["ga:week"]);
        usage.views = Number(d["ga:pageviews"]);
        usage.date = new Date(Number(tempdate.substr(0,4)),Number(tempdate.substr(4,2))-1,Number(tempdate.substr(6,2)));
        usage.label = (d["ga:date"]);

        if(usage.year===2016)
          STATISTICS.push(usage);
      }


      context.minweek = d3.min(STATISTICS, function (d) { return d.week; });

      context.initSvg();
      context.drawHeat(STATISTICS);
      context.brush();

    });
  }
  private drawHeat(data:Usage[]) {
    console.log(data);


    let context = this;

    let gridSize = 10;

    let rect = this.svg.selectAll("rect").data(data)
      .enter().append("rect")
      .attr("x",function(d){return context.scaleWeek(d.week);})
      //.attr("y", function(d) { return (d.dow-1) * gridSize; })
      .attr("y",function(d){return context.scaleDay(d.dow );})
      .attr("width",10)
      .attr("height",10)
      .attr("rx", 1)
      .attr("ry", 1)
      .style("fill",function(d:Usage){return context.color(d.views);});
  }
  private initSvg() {

    const context = this;

    this.scaleDay = d3.scaleLinear()
      .domain([0,7])
      .range([0,this.height]);


    this.scaleWeek = d3.scaleTime()
      .domain([0,54])
      .range([0,this.width]);

    this.color = d3.scaleLinear<RGBColor>().domain(d3.extent(STATISTICS,function(d){return d.views;})).interpolate(d3.interpolateRgb)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

    this.svg = d3.select('svg')
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom );


    // Add the x-axis.
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.scaleWeek).ticks(53));

    // Add the y-axis.
    this.svg.append("g")
      .call(d3.axisRight(this.scaleDay).ticks(7).tickFormat(function(d:number, i){
        return context.weekdays[d];
      }));

  }


  private brushed() {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    let d0 = d3.event.selection.map(this.scaleWeek.invert),
      d1 = d0.map(d3.timeDay.round);

    // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
      d1[0] = d3.timeDay.floor(d0[0]);
      d1[1] = d3.timeDay.offset(d1[0]);
    }

    d3.select('svg').transition().call(d3.event.target.move, d1.map(this.scaleWeek));
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

  private bler() {

    let context = this;

    this.dataService.getData().subscribe(data => {
      console.log(data);
      alert();
    });

    d3.json(
      'https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A106789686&start-date=2015-04-15&end-date=yesterday&metrics=ga%3Apageviews&dimensions=ga%3AnthWeek%2Cga%3AdayOfWeek&access_token=ya29.Gl2MBIMxB-scnOvGeShWrfec2YtPj1QxugAN4l39xl_iQMXyqpouz2wW32VVRFnJRwCkweU7M_i8Qoq_UWDpAFJgZmd69nNZWzkReko6li2zTfxuxd74_ZgSgigpUnM'
      , function(data) {
        alert();

        let freshData = data.rows.map(function(t){
          /*let qwe:Usage = {label: "QQWE", views: Number(t[2]), day: Number(t[1]),week:Number(t[0]), date:new Date()};
          return qwe;*/
        });
        console.log(freshData);

        context.drawHeat(freshData);


      });
  }
}
