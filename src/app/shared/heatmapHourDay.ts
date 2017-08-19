import {Heatmap} from "./heatmap";
import {Hourly, Usage} from "./data";
import {RGBColor} from "d3-color";
import * as d3 from 'd3';


export class HeatmapHourDay extends Heatmap
{
  public draw(data: Usage[]): void {
    const context = this;

    let hourly = d3.nest<Usage,any>()
      .key(function(t:Usage){return t.dow+"__"+t.hour;})
      //.rollup(function(d:Usage[]){return  d3.mean(d,function(g:Usage){return g.views;});})
      .rollup(function(d){
        return {
          views: d3.mean(d,function(g:Usage){return g.views;}),
          startDate: d3.min(d,function(g:Usage){return g.date;}),
          endDate: d3.max(d,function(g:Usage){return g.date;}),
        };
      })
      .entries(data)
      .map(function(t){
        return new Hourly(Number(t.key.split("__")[0]),Number(t.key.split("__")[1]),t.value.views,t.value.startDate,t.value.endDate);
      });

    let weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    let summo = d3.nest<Hourly,any>()
      .key(function(t:Hourly){return t.dow.toString();})
      .rollup(function (d){return d3.sum(d,function(g:Hourly){return g.views;});})
      .entries(hourly);
    const sums = this.svg.selectAll(".averages")
      .data(summo);
    sums
      .enter().append("text")
      .attr("x", this.width)
      .attr("y", (d, i) => i * context.gridSize*1.05 + context.gridSize*0.7 )
      .style("text-anchor", "start")
      .attr("class","averages")
      .text(function (d) { return Math.round(d.value)+" views"; });


    sums
      .text(function (d) { return Math.round(d.value)+" views"; });


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
      .on('mouseover', (d) => {
        context.tooltip.transition()
          .duration(100)
          .style('opacity', .9);
        context.tooltip.text(`${d.hour}h  ${d.startDate.toString('dddd, MMMM ,yyyy')} - ${d.endDate.toString('dddd, MMMM ,yyyy')} : ${d.views}`)
          .style('left', `${d3.event.pageX - 55}px`)
          .style('top', `${d3.event.pageY - 40}px`);
      })
      .on('mouseout', () => {
        context.tooltip.transition()
          .duration(400)
          .style('opacity', 0);
      });

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

    this.tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip');


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
      .attr("x", 0)
      .attr("y", (d, i) => i * context.gridSize*3.7)
      .style("text-anchor", "end")
      .attr("transform", "translate(-5," + context.gridSize*2.1 + ") ")
      //.attr("transform", "rotate(90deg)")
      .attr("class", (d, i) => ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"))
      //.selectAll("text")
      .text(function (d) { return d; });





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
