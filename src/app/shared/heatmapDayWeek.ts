import {Heatmap} from "./heatmap";
import * as d3 from 'd3';
import {Usage} from "./data";
import {RGBColor} from "d3-color";

export class HeatmapDayWeek extends Heatmap
{




  constructor(id: string, height: number, width: number, margin: any, brushcallback: any) {
    super(id, height, width, margin, brushcallback);



  }

  public draw(data: Usage[]): void {
    const context = this;


    this.scaleColor = d3.scaleLinear<RGBColor>()
      .domain(d3.extent(data,function(d){return d.views;}))
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

    const rect = this.svg.selectAll("rect").data(data)
      .enter().append("rect")
      .attr("x",function(d){return context.scaleX(d.week+0.1);})
      .attr("y",function(d){return context.scaleY(d.dow );})
      .attr("width",this.gridSize)
      .attr("height",this.gridSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .style("fill",function(d:Usage){return context.scaleColor(d.views);});


    if(this.brushCallback!=null)
      this.setupBrush();
  }

  protected setup(): void {
    const context = this;

    let times = [];
    let weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];


    for(let i = 1; i<54;i++)
    {
      times.push("Week "+i);
    }

    console.log(times);

    this.scaleY = d3.scaleLinear()
      .domain([0,7])
      .range([0,this.height]);

    this.scaleX = d3.scaleLinear()
      .domain([0,53])
      .range([0,this.width]);



    // Add the x-axis.
    /*this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.scaleX).ticks(53));*/

    /*// Add the y-axis.
    this.svg.append("g")
      .call(d3.axisRight(this.scaleY).ticks(7).tickFormat(function(d:number, i){
        return HeatmapDayWeek.weekdays[d];
        //return'1';
      }));*/

    const dayLabels = this.svg.selectAll(".dayLabel")
      .data(weekdays)
      .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", (d, i) => i * context.gridSize*1.45)
      .style("text-anchor", "end")
      .attr("transform", "translate(+6," + context.gridSize / 1.2 + ")")
      .attr("class", (d, i) => ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));

    const timeLabels = this.svg.selectAll(".timeLabel")
      .data(times)
      .enter().append("text")
      .text((d) => d)
      .attr("x", (d, i) => i * this.gridSize)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + this.gridSize + ", -6)")
      .attr("class", (d, i) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));
  }




}
