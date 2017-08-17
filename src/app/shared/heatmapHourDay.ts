import {Heatmap} from "./heatmap";
import {Hourly, Usage} from "./data";
import {RGBColor} from "d3-color";
import * as d3 from 'd3';


export class HeatmapHourDay extends Heatmap
{
  public draw(data: Usage[]): void {
    const context = this;

    let hourly = d3.nest<Usage,number>()
      .key(function(t:Usage){return t.dow+"__"+t.hour;})
      //.rollup(function(d:Usage[]){return  d3.mean(d,function(g:Usage){return g.views;});})
      .rollup(function(d){return d3.mean(d,function(g:Usage){return g.views;});})
      .entries(data)
      .map(function(t){
        return new Hourly(Number(t.key.split("__")[0]),Number(t.key.split("__")[1]),t.value);
      });


    this.scaleColor = d3.scaleLinear<RGBColor>()
      .domain(d3.extent(hourly,function(d){return d.views;}))
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

    const rect = this.svg.selectAll("rect").data(hourly);

    rect.enter().append("rect");
    rect
      .attr("x",function(d){return context.scaleX(d.dow);})
      .attr("y",function(d){return context.scaleY(d.hour );})
      .attr("width",this.gridSize)
      .attr("height",this.gridSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .style("fill",function(d:Usage){return context.scaleColor(d.views);});


    if(this.brushCallback!=null)
      this.setupBrush();
  }

  protected setup(): void {

    this.scaleX = d3.scaleLinear()
      .domain([0,7])
      .range([0,this.width]);

    this.scaleY = d3.scaleLinear()
      .domain([0,24])
      .range([0,this.height]);



    // Add the x-axis.
    this.svg.append("g")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.scaleX).ticks(7));

    // Add the y-axis.
    this.svg.append("g")
      .attr("transform", "translate(0,0)")
      .call(d3.axisLeft(this.scaleY).ticks(24).tickFormat(function(d:number, i){
        //return context.weekdays[d];
        return "'";
      }));
  }
}
