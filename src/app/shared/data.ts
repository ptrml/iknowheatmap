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


  constructor(dow: number, hour: number,views: number) {
    this.dow = dow;
    this.hour = hour;
    this.views = views;
  }
}



/*
*
  {label: "A", dow: 1,week:1,year:2017, views:2, date:new Date()},
  {label: "B", dow: 1,week:2,year:2017, views:2, date:new Date()},
  {label: "C", dow: 7,week:1,year:2017, views:2, date:new Date()},
  {label: "D", dow: 3,week:1,year:2017, views:2, date:new Date()},
  {label: "E", dow: 2,week:2,year:2017, views:2, date:new Date()},*/
