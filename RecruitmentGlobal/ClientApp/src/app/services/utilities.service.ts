import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public IsNullOrEmpty(value: string) {
    return value == null || value == undefined || value == '' || value.toString().trim() == '';
  }
}
