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
      //.domain(d3.extent(data,function(d){return d.views;}))
      .domain([0,30000])
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb(this.colors[0]), d3.rgb(this.colors[1])]);


    const rect = this.svg.selectAll("rect").data(data);



    const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip');

    rect.append("q");
    rect.enter().append("rect")


      .attr("x",function(d){return context.scaleX(d.week+0.1);})
      .attr("y",function(d){return context.scaleY(d.dow );})
      .attr("width",this.gridSize)
      .attr("height",this.gridSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .style("fill",function(d:Usage){return context.scaleColor(d.views);})
      .on('mouseover', (d) => {
        tooltip.transition()
          .duration(100)
          .style('opacity', .9);
        tooltip.text(`qwe`)
          .style('left', `${d3.event.pageX - 55}px`)
          .style('top', `${d3.event.pageY - 40}px`);
      });


    rect.transition().duration(500)
      .style("fill", function(d) { return context.scaleColor(d.views); });


    rect.exit().remove();


    /*const legend = this.svg.selectAll(".legend")
      .data([0].concat(this.scaleColor.quantiles()), function(d) { return d; });

    legend.enter().append("g")
      .attr("class", "legend");

    legend.append("rect")
      .attr("x", function(d, i) { return 40 * i; })
      .attr("y", 20)
      .attr("width", 40)
      .attr("height", 20 / 2)
      .style("fill", function(d, i) { return context.colors[i]; });

    legend.append("text")
      .attr("class", "mono")
      .text(function(d) { return "≥ " + Math.round(d); })
      .attr("x", function(d, i) { return 40 * i; })
      .attr("y", 20 + 20);

    legend.exit().remove();*/


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

    this.scaleY = d3.scaleLinear()
      .domain([0,7])
      .range([0,this.height]);

    this.scaleX = d3.scaleLinear()
      .domain([1,54])
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
      .attr("y", (d, i) => i * context.gridSize*1.1)
      .style("text-anchor", "end")
      .attr("transform", "translate(-3," + context.gridSize / 1.2 + ") ")
      .attr("font-size", "0.7em")
      .attr("class", "dayLabel mono axis axis-workweek");




    const timeLabels = this.svg.selectAll(".timeLabel")
      .data(times)
      .enter().append("g")
      //.text((d) => d)
      //.attr("x", (d, i) => i * this.gridSize)
      .attr("y", 0)
      //.style("text-anchor", "middle")
      .attr("transform", (d, i) => "translate(" + (1.5*this.gridSize + i * 1.045 * this.gridSize) + ", -"+2*this.gridSize+")")
      //.attr("class", "timeLabel mono axis axis-worktime")
      .append("text")
      .text((d) => d)
      .style("text-anchor", "middle")
      .attr("transform", "rotate(-65)")
      .attr("font-size", "0.7em")
      .attr("class", "timeLabel mono axis axis-worktime");
  }




}
