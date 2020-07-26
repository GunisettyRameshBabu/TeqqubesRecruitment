import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterDataTypes } from '../constants/api-end-points';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterdataService {
  constructor(private http: HttpClient) {}

  getMasterDataByType(type: MasterDataTypes, includeDefault: boolean = false) {
    return this.http.get(
      environment.apiUrl + 'MasterDatas/GetMasterDataByType/' + (type as number) + '/' + includeDefault
    );
  }

  getMasterDataType() {
    return this.http.get(environment.apiUrl + 'MasterDataTypes');
  }

  getMasterData(req) {
    return this.http.post(environment.apiUrl + 'MasterDatas/GetMasterData', req);
  }

  addOrUpdateMasterData(data: any) {
    if (data.id > 0) {
      return this.http.put(environment.apiUrl + 'MasterDatas/' + data.id, data);
    } else {
      return this.http.post(environment.apiUrl + 'MasterDatas', data);
    }
  }

  addOrUpdateState(data: any) {
    if (data.id > 0) {
      return this.http.put(environment.apiUrl + 'States/' + data.id, data);
    } else {
      return this.http.post(environment.apiUrl + 'States', data);
    }
  }

  addOrUpdateCity(data: any) {
    if (data.id > 0) {
      return this.http.put(environment.apiUrl + 'Cities/' + data.id, data);
    } else {
      return this.http.post(environment.apiUrl + 'Cities', data);
    }
  }

  addOrUpdateCountry(data: any) {
    if (data.id > 0) {
      return this.http.put(environment.apiUrl + 'Countries/' + data.id, data);
    } else {
      return this.http.post(environment.apiUrl + 'Countries', data);
    }
  }

  addOrUpdateClientCodes(data: any) {
    if (data.id > 0) {
      return this.http.put(environment.apiUrl + 'ClientCodes/' + data.id, data);
    } else {
      return this.http.post(environment.apiUrl + 'ClientCodes', data);
    }
  }

  getAllCountries() {
    return this.http.get(environment.apiUrl + 'Countries');
  }

  getCountries(req) {
    return this.http.post(environment.apiUrl + 'Countries/GetCountries',req);
  }

  getStates(req) {
    return this.http.post(environment.apiUrl + 'States/GetStates', req);
  }

  getCities(req) {
    return this.http.post(environment.apiUrl + 'Cities/GetCities', req);
  }

  getAllClients() {
    return this.http.get(environment.apiUrl + 'ClientCodes');
  }

  getClients(req) {
    return this.http.post(environment.apiUrl + 'ClientCodes/GetClientCodes',req);
  }

  getUserLogs(req) {
    return this.http.post(environment.apiUrl + 'UserSessions/GetUserSessions', req);
  }
}
