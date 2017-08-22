import {Observer} from "./Observer";
import {isUndefined} from "util";
import {Util} from "./Util";

export class DetailView {
  private _rangeFrom: number;
  private _rangeTo: number;
  private _totalViews: number;
  private _averagePerDay: number;
  private _text: string;

  public printRange(){
    if(!isUndefined(this.rangeFrom) && this.rangeFrom !=null)
      return this.rangeFrom + " - " + this.rangeTo;
    else
      return "";
  }

  get rangeFrom(): number {
    return this._rangeFrom;
  }

  set rangeFrom(value: number) {
    this._rangeFrom = value;
  }

  get rangeTo(): number {
    return this._rangeTo;
  }

  set rangeTo(value: number) {
    this._rangeTo = value;
  }

  get totalViews(): number {
    return Util.round(this._totalViews);
  }

  set totalViews(value: number) {
    this._totalViews = value;
  }

  get averagePerDay(): number {
    return Util.round(this._averagePerDay);
  }

  set averagePerDay(value: number) {
    this._averagePerDay = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }
}
