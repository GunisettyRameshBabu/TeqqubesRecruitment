import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MasterDataTypes } from '../constants/api-end-points';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  GetUsersByCountry() {
    return this.http.get(environment.apiUrl + 'Users/GetUsersByCountry');
  }

  constructor(private http: HttpClient) {}

  getClientCodes() {
    return this.http.get(environment.apiUrl + 'ClientCodes');
  }

  getCountries() {
    return this.http.get(environment.apiUrl + 'Countries');
  }

  getCountriesByUserId() {
    return this.http.get(environment.apiUrl + 'Countries/GetCountriesByUserId');
  }

  getStatesByCountry(id: number) {
    return this.http.get(
      environment.apiUrl + 'States/GetStatesByCountry/' + id
    );
  }

  getCitiesByState(id: number,isDefaults = false) {
    return this.http.get(environment.apiUrl + 'Cities/GetCitiesByState/' + id + '/' + isDefaults);
  }

  downloadResume(id: number, type = 'j') {
    if (type == 'j') {
      return this.http.get(
        environment.apiUrl + 'JobCandidates/Download/' + id,
        { responseType: 'blob' }
      );
    } else {
      return this.http.get(
        environment.apiUrl + 'RecruitCares/Download/' + id,
        { responseType: 'blob' }
      );
    }
  }

  getCountryById(id) {
    return this.http.get(environment.apiUrl + 'Countries/' + id);
  }

  getCountryCodeByJobId(id) {
    return this.http.get(
      environment.apiUrl + 'Openings/GetCountryCodeByJobId/' + id
    );
  }
}
