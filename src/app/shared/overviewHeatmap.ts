import {Heatmap} from "./heatmap";
import * as d3 from 'd3';
import {Usage} from "./data";
import {RGBColor} from "d3-color";

export class OverviewHeatmap extends Heatmap
{
  public draw(data: Usage[]): void {
    const context = this;


    this.scaleColor = d3.scaleLinear<RGBColor>()
      .domain(d3.extent(data,function(d){return d.views;}))
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

    const rect = this.svg.selectAll("rect").data(data)
      .enter().append("rect")
      .attr("x",function(d){return context.scaleX(d.week);})
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
    this.scaleY = d3.scaleLinear()
      .domain([0,7])
      .range([0,this.height]);

    this.scaleX = d3.scaleLinear()
      .domain([0,54])
      .range([0,this.width]);



    // Add the x-axis.
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.scaleX).ticks(53));

    // Add the y-axis.
    this.svg.append("g")
      .call(d3.axisRight(this.scaleY).ticks(7).tickFormat(function(d:number, i){
        //return context.weekdays[d];
        return "'";
      }));
  }




}
