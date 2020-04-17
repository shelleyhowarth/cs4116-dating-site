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
        imgName: 'home-run',
        imgSrc: 'https://firebasestorage.googleapis.com/v0/b/cs4116-group4-dating.appspot.com/o/icons%2Fhome-run.svg?alt=media&token=170ff820-3fa4-4c17-9b2c-14f5dff2ad21'
    },
    {
      name: 'Messages',
      routing: 'message',
      imgName: 'email',
      imgSrc: 'https://firebasestorage.googleapis.com/v0/b/cs4116-group4-dating.appspot.com/o/icons%2Femail.svg?alt=media&token=b768280d-7fb8-406e-ba86-a76497f52202'
    },
    {
      name: 'Search',
      routing: 'search',
      imgName: 'search',
      imgSrc: 'https://firebasestorage.googleapis.com/v0/b/cs4116-group4-dating.appspot.com/o/icons%2Fsearch.svg?alt=media&token=8bc1ebb1-cd78-4a74-ae1e-57b2904f7c39'
    },
    {
      name: 'My Profile',
      routing: 'my-profile',
      imgName: 'user',
      imgSrc: 'https://firebasestorage.googleapis.com/v0/b/cs4116-group4-dating.appspot.com/o/icons%2Fuser.svg?alt=media&token=060e1187-1f0d-4dc7-9712-63e6d6525f2b'
    },
    {
      name: 'Log Out',
      routing: 'login',
      imgName: 'switch',
      imgSrc: 'https://firebasestorage.googleapis.com/v0/b/cs4116-group4-dating.appspot.com/o/icons%2Fswitch.svg?alt=media&token=e4e3fbfe-222f-4cf3-b454-7428d8e14ea6'
    }
  ]

  constructor(public routing: Router, public authService: AuthService) { }

  ngOnInit(): void { }

}
