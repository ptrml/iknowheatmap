export class Usage {
  label: string;
  dow: number;
  week: number;
  hour: number;
  year: number;
  views:number;
  date: Date;
}

export class Hourly {
  dow: number;
  views: number;
  hour: number;
  startDate: Date;
  endDate: Date;


  constructor(dow: number, hour: number,views: number, startDate: Date, endDate: Date) {
    this.dow = dow;
    this.views = views;
    this.hour = hour;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}



/*
*
  {label: "A", dow: 1,week:1,year:2017, views:2, date:new Date()},
  {label: "B", dow: 1,week:2,year:2017, views:2, date:new Date()},
  {label: "C", dow: 7,week:1,year:2017, views:2, date:new Date()},
  {label: "D", dow: 3,week:1,year:2017, views:2, date:new Date()},
  {label: "E", dow: 2,week:2,year:2017, views:2, date:new Date()},*/
