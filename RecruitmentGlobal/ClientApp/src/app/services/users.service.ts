import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(environment.apiUrl + 'Users');
  }

  adduser(user: User) {
    return this.http.post(environment.apiUrl + 'Users', user);
  }

  updateuser(user: User) {
    return this.http.put(environment.apiUrl + 'Users/'+ user.id, user);
  }
}
