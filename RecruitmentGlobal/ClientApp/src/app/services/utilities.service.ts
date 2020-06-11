import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public IsNullOrEmpty(value: string) {
    return value == null || value == undefined || value == '' || value.toString().trim() == '';
  }

  public convertToLocalDate(date) {
    return date ==null || date == undefined ? date : this.getdate(date);
  }

  getdate(date: string) {
    date = date.replace('T', ' ');
    let time = "";
    if (typeof date === "number") {
      time = new Date(date).toLocaleString();
    } else if (typeof date === "string") {
      time = new Date(`${date} UTC`).toLocaleString();
    } else  {
      time = new Date(`${date} UTC`).toLocaleString();
    }

    return time;
  }
}
