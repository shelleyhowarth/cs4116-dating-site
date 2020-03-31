import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';

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
        imgName: 'home-run',
        imageSrc: ''
    },
    {
      name: 'Messages',
      routing: 'message',
      imgName: 'email',
      imageSrc: ''
    },
    {
      name: 'Search',
      routing: 'search',
      imgName: 'search',
      imageSrc: ''
    },
    {
      name: 'My Profile',
      routing: 'my-profile',
      imgName: 'user',
      imageSrc: ''
    },
    {
      name: 'Log Out',
      routing: 'login',
      imgName: 'switch',
      imageSrc: ''
    }
  ]

  constructor(public routing: Router, public authService: AuthService) { }

  ngOnInit(): void {
    console.log(this.authService.isAuthenticated());

    this.navItems.forEach( item => {
      var picLocation = "icons/"  + item.imgName + ".jpeg";
      //add imgSrc attribute and set as avatarURL

      var picRef = firebase.storage().ref(picLocation);
      picRef.getDownloadURL().then(res => {
        item.imageSrc = res;
      });
    })
    

  }

}
