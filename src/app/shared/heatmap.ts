import * as d3 from 'd3';
import { Usage } from '../shared/data';
import {RGBColor} from "d3-color";
import {isUndefined} from "util";
import {DetailView} from "./DetailView";

export abstract class Heatmap {
  private _scaleX:any;
  private _scaleY:any;
  private _scaleColor:any;
  private _width:number;
  private _height:number;
  private _margin:any;
  private _svg:any;
  private _gridSize = 10;
  protected brushCallback=null;
  private _tooltip = null;
  private _observer: DetailView;


  protected colors = ["#FFF4F9",'#008DD5','#FE5F55'];


  constructor(id: string,height: number, width: number, margin: any,brushcallback?:any,gridsize?:number) {

    this.margin = margin;
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;
    this.brushCallback = brushcallback || null;
    this.gridSize = gridsize || 10;

    this.svg = d3.select('#'+id)
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom )
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    this.setup();


  }

  protected abstract setup():void;

  public abstract draw(data:Usage[]):void;

  protected setupBrush()
  {

    const context = this;
    const brush = d3.brushX()
      .extent([[this.scaleX.range()[0], this.scaleY.range()[0]], [this.scaleX.range()[1], this.scaleY.range()[1]]])
      //.extent([[0, 0], [300, 300]])
      .on("end",brushed);

    this.svg.select(".brush").remove();
    const slider = this.svg.append("g").attr("class", "brush").call(brush);

    this.svg.select(".overlay")
      .on('mouseover', (d) => {
      context.observer.text = `Click and pull to select area`;
      context.svg.select(".bordero").transition();
        context.svg.select(".bordero").transition().duration(500)
          .style("opacity",0);
    })
      .on('mouseout', () => {
        context.observer.text = "";
      });

    this.svg.select(".selection")
      .on('mouseover', (d) => {
        context.observer.text = `Click and pull to move selected area`;
      })
      .on('mouseout', () => {
        context.observer.text = "";
      });

    function brushed()
    {

      if (!d3.event.sourceEvent) return; // Only transition after input.
      if (!d3.event.selection) return; // Ignore empty selections.
      const d0 = d3.event.selection.map(context.scaleX.invert);
      const d1 = d0.map(Math.round);

      // If empty when rounded, use floor & ceil instead.
      if (d1[0] >= d1[1]) {
        d1[0] = Math.floor(d0[0]);
        //d1[1] = d3.timeDay.offset(d1[0]);
      }

      d3.select(this).transition().call(d3.event.target.move, d1.map(context.scaleX));

      context.observer.rangeFrom = d1[0];
      context.observer.rangeTo = d1[1]-1;

      context.brushCallback(d1[0],d1[1]);
    }
  }

  get scaleX(): any {
    return this._scaleX;
  }

  set scaleX(value: any) {
    this._scaleX = value;
  }

  get scaleY(): any {
    return this._scaleY;
  }

  set scaleY(value: any) {
    this._scaleY = value;
  }

  get scaleColor(): any {
    return this._scaleColor;
  }

  set scaleColor(value: any) {
    this._scaleColor = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get margin(): any {
    return this._margin;
  }

  set margin(value: any) {
    this._margin = value;
  }

  get svg(): any {
    return this._svg;
  }

  set svg(value: any) {
    this._svg = value;
  }


  set gridSize(value: number) {
    this._gridSize = value;
  }


  get gridSize(): number {
    return this._gridSize;
  }


  get tooltip(): any {
    return this._tooltip;
  }

  set tooltip(value: any) {
    this._tooltip = value;
  }


  get observer(): DetailView {
    return this._observer;
  }

  set observer(value: DetailView) {
    this._observer = value;
  }
}
