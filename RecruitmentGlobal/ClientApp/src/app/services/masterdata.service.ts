import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterDataTypes } from '../constants/api-end-points';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterdataService {
  constructor(private http: HttpClient) {}

  getMasterDataByType(type: MasterDataTypes) {
    return this.http.get(
      environment.apiUrl + 'MasterDatas/GetMasterDataByType/' + (type as number)
    );
  }

  getMasterDataType() {
    return this.http.get(environment.apiUrl + 'MasterDataTypes');
  }

  getMasterData() {
    return this.http.get(environment.apiUrl + 'MasterDatas');
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

  getCountries() {
    return this.http.get(environment.apiUrl + 'Countries');
  }

  getStates() {
    return this.http.get(environment.apiUrl + 'States');
  }

  getCities() {
    return this.http.get(environment.apiUrl + 'Cities');
  }

  getClients() {
    return this.http.get(environment.apiUrl + 'ClientCodes');
  }

  getUserLogs() {
    return this.http.get(environment.apiUrl + 'UserSessions');
  }
}
