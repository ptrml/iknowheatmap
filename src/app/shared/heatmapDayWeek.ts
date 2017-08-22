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
    const fillLine2 = "#FF0F80";


    this.scaleColor = d3.scaleLinear<RGBColor>()
      //.domain(d3.extent(data,function(d){return d.views;}))
      .domain([0,30000])
      .interpolate(d3.interpolateRgb)
      .range([d3.rgb(this.colors[0]), d3.rgb(this.colors[1])]);


    let chart = this.svg.append("g")
      .attr("class","chart");



    this.svg.selectAll("rect").remove();
    const rect = chart.selectAll("rect").data(data);

    rect.transition().duration(500)
      .style("fill", function(d) { return context.scaleColor(d.views); });




    //rect.append("q");
    rect.enter().append("rect")


      .attr("x",function(d){return context.scaleX(d.week+0.1);})
      .attr("y",function(d){return context.scaleY(d.dow );})
      .attr("width",this.gridSize)
      .attr("height",this.gridSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("class", "node")
      .style("fill",function(d:Usage){return context.scaleColor(d.views);})


    rect.exit().remove();


    if(this.brushCallback!=null)
      this.setupBrush();


    const border = this.svg.append("rect");
    border
      .attr("x",0)
      .attr("y",0)
      .attr("height",this.height)
      .attr("width",this.width)
      .attr("class","bordero")
      .style("stroke",fillLine2)
      .style("fill","none")
      .attr("stroke-width", 4)
      .style("opacity",0);

    border.transition().duration(600)
      .style("opacity",1)
      .transition().duration(600)
      .style("opacity",0.2)
    .transition().duration(600)
      .style("opacity",1)
    .transition().duration(600)
      .style("opacity",0.2)
      .transition().duration(600)
      .style("opacity",1)
      .transition().duration(750)
      .style("opacity",0.2)
      .transition().duration(1000)
      .style("opacity",1);




  }

  protected setup(): void {
    const context = this;

    let times = [];
    let weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    let dummyData:Usage[] = [];
    for(let i = 1; i<54;i++)
    {
      times.push("Week "+i);

      for(let j = 0; j<7;j++)
      {
        let tempy = new Usage();
        tempy.dow=j;
        tempy.week=i;
        dummyData.push(tempy);
      }
    }





    this.scaleY = d3.scaleLinear()
      .domain([0,7])
      .range([0,this.height]);

    this.scaleX = d3.scaleLinear()
      .domain([1,54])
      .range([0,this.width]);





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




    this.svg.selectAll("rect").remove();
    const rect = this.svg.selectAll("rect").data(dummyData);

    //rect.append("q");
    rect.enter().append("rect")


      .attr("x",function(d){return context.scaleX(d.week+0.1);})
      .attr("y",function(d){return context.scaleY(d.dow );})
      .attr("width",this.gridSize)
      .attr("height",this.gridSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .style("fill",function(d:Usage){return "#AAAAAA";});






  }




}
