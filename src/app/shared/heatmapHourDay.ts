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
      .range([d3.rgb(this.colors[0]), d3.rgb(this.colors[1])]);

    const rect = this.svg.selectAll("rect").data(hourly);

    rect.append("q");

    rect.enter().append("rect")

      .attr("x",function(d){return context.scaleY(d.hour );})
      .attr("y",function(d){console.log(context.scaleX); return context.scaleX(d.dow);})
      .attr("width",this.gridSize)
      .attr("height",this.gridSize)
      .attr("rx", 4)
      .attr("ry", 4)
      .style("fill",function(d:Usage){return context.scaleColor(d.views);})

    rect.transition().duration(500)
      .style("fill", function(d) { return context.scaleColor(d.views); });


    rect.exit().remove();

    if(this.brushCallback!=null)
      this.setupBrush();
  }

  protected setup(): void {

    const context = this;
    let times = [];
    let weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    for(let i = 0; i<24;i++)
    {
      times.push(""+i+"h");
    }

    this.scaleX = d3.scaleLinear()
      .domain([0,24])
      .range([0,this.width]);

    this.scaleY = d3.scaleLinear()
      .domain([0,7])
      .range([0,this.height]);


/*
    // Add the x-axis.
    this.svg.append("g")
      //.attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisLeft(this.scaleY).ticks(7));

    // Add the y-axis.
    this.svg.append("g")
      //.attr("transform", "translate(0,0)")
      .call(d3.axisBottom(this.scaleX).ticks(24).tickFormat(function(d:number, i){
        //return context.weekdays[d];
        return "'";
      }));*/

    const dayLabels = this.svg.selectAll(".dayLabel")
      .data(weekdays)
      .enter().append("text")
      .text(function (d) { return d; })
      .attr("x", 0)
      .attr("y", (d, i) => i * context.gridSize*3.7)
      .style("text-anchor", "end")
      .attr("transform", "translate(-5," + context.gridSize*2.1 + ")")
      .attr("class", (d, i) => ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"));

    const timeLabels = this.svg.selectAll(".timeLabel")
      .data(times)
      .enter().append("text")
      .text((d) => d)
      .attr("x", (d, i) => i * context.gridSize*3.72)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .attr("transform", "translate(" + context.margin.left/1.8 + ", "+(Number(context.height)+context.gridSize*1.5)+")")
      .attr("class", (d, i) => ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"));

  }
}
