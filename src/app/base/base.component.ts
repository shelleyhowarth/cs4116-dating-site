import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  newUser: User;
  user;
  uid;
  isAdmin;

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

  constructor(public routing: Router, public authService: AuthService, private firestore: AngularFirestore) { }

  ngOnInit(): void {

    this.user = firebase.auth().currentUser;
    if (this.user != null) {
      this.uid = this.user.uid;
    }

    this.getUserInfo();

    this.isAdmin = this.newUser.admin;
    console.log("admin " + this.isAdmin);
  }

  getUserInfo() {
    var docRef = this.firestore.collection("Users").doc(this.uid).get();

    docRef.subscribe(doc => {
      var object = new User();
      object.firstName = doc.data().firstName;
      object.lastName = doc.data().lastName;
      object.age = doc.data().age;
      object.description = doc.data().description;
      object.gender = doc.data().gender;
      object.email = doc.data().email;
      object.favoriteSong = doc.data().favoriteSong;
      object.favoriteMovie = doc.data().favoriteMovie;
      object.county = doc.data().county;
      object.drinker = doc.data().drinker;
      object.maritalStatus = doc.data().maritalStatus;
      object.occupation = doc.data().occupation;
      object.smoker = doc.data().smoker;
      object.interests = doc.data().interests;
      object.uid = doc.data().uid;
      object.profilePic = doc.data().profilePic;
      object.admin = doc.data().admin;
      object.disabled = doc.data().disabled;
      console.log(object.admin);
      this.newUser = object;
    });
    console.log(this.newUser.admin);
  }

}
