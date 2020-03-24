import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  navItems = [
    {
        name: 'Home',
        routing: 'home',
        imgPath: '../assets/home-run.svg'
    },
    {
      name: 'Messages',
      routing: 'message',
      imgPath: '../assets/email.svg'
    },
    {
      name: 'Search',
      routing: 'search',
      imgPath: '../assets/search.svg'
    },
    {
      name: 'My Profile',
      routing: 'my-profile',
      imgPath: '../assets/user.svg'
    },
    {
      name: 'Log Out',
      routing: 'login',
      imgPath: '../assets/switch.svg'
    }
  ]

  constructor(public routing: Router, public authService: AuthService) { }

  ngOnInit(): void {
    console.log(this.authService.isAuthenticated());
  }

}
