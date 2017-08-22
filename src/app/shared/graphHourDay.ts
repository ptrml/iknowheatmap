import {Heatmap} from "./heatmap";
import * as d3 from 'd3';

import {Hourly, Usage} from "./data";
import {Util} from "./Util";

export class GraphHourDay extends Heatmap {
  protected setup(): void {
    const context = this;
    let times = [];

    for(let i = 0; i<24;i++)
    {
      times.push(""+i+"h");
    }

    this.scaleX = d3.scaleLinear()
      .domain([0,24])
      .range([0,this.width]);

  }

  draw(data: Usage[]): void {

    const context = this;
    const fillLine1 = "#008DD5";
    const fillLine2 = "#FF0F80";


    console.log(data);

    let hourly = d3.nest<Usage,any>()
      .key(function(t:Usage){return ""+t.hour;})
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
        return new Hourly(0,Number(t.key),t.value.views,t.value.startDate,t.value.endDate);
      });

    let hourly2 = d3.nest<Usage,any>()//without weekends
      .key(function(t:Usage){return ""+t.hour;})
      //.rollup(function(d:Usage[]){return  d3.mean(d,function(g:Usage){return g.views;});})
      .rollup(function(d){
        return {
          views: d3.mean(d,function(g:Usage){return g.views;}),
          startDate: d3.min(d,function(g:Usage){return g.date;}),
          endDate: d3.max(d,function(g:Usage){return g.date;}),
        };
      })
      .entries(data.filter(function(t:Usage){if(t.dow !== 0 && t.dow!==6)return t;}))
      .map(function(t){
        return new Hourly(0,Number(t.key),t.value.views,t.value.startDate,t.value.endDate);
      });


    const domain = d3.extent(data,function(d){return d.views;});
    this.scaleY = d3.scaleLinear()
      .domain(domain)
      .range([this.height,0]);



    let chart = this.svg.append("g")
      .attr("transform", "translate(" + context.gridSize/2 + ",0)");

    this.svg.selectAll("circle").remove();
    const circle = chart.selectAll("circle").data(data);
    circle.append("q");
    circle.enter().append("circle")
      .attr("cy",function(d:Usage){return context.scaleY(d.views);})
      .attr("cx",function(d:Usage){return context.scaleX(d.hour);})
      .attr('r',4)
      .style("fill","#DDD")
      .on('mouseover', (d) => {
        context.observer.text = d.date.toDateString()+" "+d.hour+"h: "+d.views+" views";
      })
      .on('mouseout', () => {
        context.observer.text = "";
      })
      .style("opacity","0.6")
      .append("svg:title")
      .text(function(d:Usage, i) { return d.views+" views"; })
      ;


    const lineFunction = d3.line<Hourly>()
      .x(function(d:Hourly) { return context.scaleX(d.hour); })
      .y(function(d:Hourly) { return  context.scaleY(d.views);});





    this.svg.selectAll(".line").remove();

    chart.append("path")
      .attr("class", "line")
      .data(hourly)
      .attr("d", lineFunction(hourly2))
      .attr("stroke", fillLine2)
      .attr("stroke-width", 5)
      .attr("fill", "none")
      .attr("fill", "none").on('mouseover', (d) => {
      context.observer.text = "Average views in hour excluding weekends";
    })
      .on('mouseout', () => {
        context.observer.text = "";
      })
    ;

    chart.selectAll(".avgNodes2").remove();
    const avgNodes2 = chart.selectAll("rect").data(hourly2);
    avgNodes2.append("q");
    avgNodes2.enter().append("circle")
      .attr("cy",function(d:Usage){return context.scaleY(d.views);})
      .attr("cx",function(d:Usage){return context.scaleX(d.hour);})
      .attr("r",6)
      .attr("class", "avgNodes2")
      //.attr("transform", "translate(-"+context.gridSize/2+",-"+context.gridSize+") ")
      .style("fill","#FFF")
      .attr("stroke-width", 3)
      .attr("stroke", fillLine2)
      .on('mouseover', (d) => {
        context.observer.text = d.hour+"h: "+Util.round(d.views)+" views average";
      })
      .on('mouseout', () => {
        context.observer.text = "";
      })
      .append("svg:title")
      .text(function(d:Usage, i) { return d.views+" views"; });



    chart.append("path")
      .attr("class", "line")
      .data(hourly)
      .attr("d", lineFunction(hourly))
      .attr("stroke", fillLine1)
      .attr("stroke-width", 5)
      .attr("fill", "none").on('mouseover', (d) => {
      context.observer.text = "Average views in hour";
    })
      .on('mouseout', () => {
        context.observer.text = "";
      })
    ;

    this.svg.selectAll(".avgNodes1").remove();
    const avgNodes1 = chart.selectAll("rect").data(hourly);
    avgNodes1.append("q");
    avgNodes1.enter().append("circle")
      .attr("cy",function(d:Usage){return context.scaleY(d.views);})
      .attr("cx",function(d:Usage){return context.scaleX(d.hour);})
      .attr("r",7)
      .attr("class", "avgNodes1")
      //.attr("transform", "translate(-"+context.gridSize/2+",-"+context.gridSize+") ")
      .style("fill","#FFF")
      .attr("stroke-width", 4)
      .attr("stroke", fillLine1)
      .on('mouseover', (d) => {
        context.observer.text = d.hour+"h: "+Util.round(d.views)+" views average";
      })
      .on('mouseout', () => {
        context.observer.text = "";
      })
      .append("svg:title")
      .text(function(d:Usage, i) { return d.views+" views"; });




    this.svg.selectAll(".axis").remove();

    // Add the x-axis.
    this.svg.append("g")
      .attr("transform", "translate(-"+this.gridSize/2+"," + this.height + ")")
      .attr("class", "axis")
      .call(d3.axisBottom(this.scaleX).ticks(23).tickFormat(function(d:number, i){
        if(d===0)return "";

        return (d-1)+"h";
      }));

    // Add the y-axis.
    this.svg.append("g")
      .attr("class", "axis")
      .call(d3.axisRight(this.scaleY).ticks(7).tickFormat(function(d:number, i){
        return d+"";
      }));


    this.svg.append("text")
      .attr("transform", "translate("+this.width/2+"," + (this.height+this.margin.bottom/2) + ")")
      .attr("class", "axis")
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Time in day");

    this.svg.append("g")
      .attr("transform", "translate(-" +this.gridSize+ ","+this.height/2+")")
      .attr("class", "axis")
      .append("text")
      .attr("transform","rotate(-90)")
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Views");



    const legend = this.svg.append("g")
      .attr("class","legend")
      .attr("transform", "translate("+this.width+"," + (this.height+this.margin.bottom/2) + ")");



    legend
      .append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("height",this.gridSize/2)
      .attr("width",this.gridSize)
      .attr("transform", "translate(-370,0)")
      .style("fill",fillLine1)
    legend
      .append("text").text("Average views in hour")
      .attr("transform", "translate(-320,13)");

    legend
      .append("rect")
      .attr("x",0)
      .attr("y",0)
      .attr("height",this.gridSize/2)
      .attr("width",this.gridSize)
      .attr("transform", "translate(-150,0)")
      .style("fill",fillLine2)
    legend
      .append("text").html("Excluding weekends")
      .attr("transform", "translate(-100,13)");

  }

}
