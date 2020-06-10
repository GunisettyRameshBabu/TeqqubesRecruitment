import { Component, OnInit } from '@angular/core';
import { UsersessionService } from 'src/app/services/usersession.service';

@Component({
  selector: 'app-un-authorized',
  templateUrl: './un-authorized.component.html',
  styleUrls: ['./un-authorized.component.css']
})
export class UnAuthorizedComponent implements OnInit {

  constructor(private userSession: UsersessionService) { }

  ngOnInit(): void {
    this.userSession.signOutSession();
  }

}
