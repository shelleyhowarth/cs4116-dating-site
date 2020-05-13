import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from "../../model/user.model";
import { AngularFirestore } from '@angular/fire/firestore';
import { NzModalService } from 'ng-zorro-antd';
import { EditInterestComponent } from './edit-profile/edit-interest/edit-interest.component';
import { EditBioComponent } from './edit-profile/edit-bio/edit-bio.component';
import { EditProfilePictureComponent } from './edit-profile/edit-profile-picture/edit-profile-picture.component';
import { EditGeneralComponent } from './edit-profile/edit-general/edit-general.component';
import { generate } from 'rxjs';

  @Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss']
  })

export class MyProfileComponent implements OnInit {
  users: Array<User> = [];
  uid = null;
  email = null;
  avatarUrl: string;
  newUser;
  user;
  currentUser = firebase.auth().currentUser;
  interests = ["Gardening", "Painting", "Reading", "Walking", "Cooking", "Baking", "Puzzles", "Music", "Exercising"];

  constructor( private firestore: AngularFirestore, private modalService: NzModalService){}

  ngOnInit(): void {
    this.getUserInfo();
  }
  
  getUserEmail(){
    this.user = firebase.auth().currentUser;

    if(this.user != null){
      this.email = this.user.email;
      this.uid = this.user.uid;
    }
  }
  
  getUserInfo(){
    this.getUserEmail();
    var docRef = this.firestore.collection("Users").doc(this.uid).valueChanges();

    docRef.subscribe(doc => {
          this.newUser = doc
          var object = new User();
          object.firstName = this.newUser.firstName;
          object.lastName = this.newUser.lastName;
          object.age =this.newUser.age;
          object.description = this.newUser.description;
          object.gender = this.newUser.gender;
          object.email = this.newUser.email;
          object.favoriteSong = this.newUser.favoriteSong;
          object.favoriteMovie = this.newUser.favoriteMovie;
          object.county =  this.newUser.county;
          object.drinker = this.newUser.drinker;
          object.maritalStatus = this.newUser.maritalStatus;
          object.occupation = this.newUser.occupation;
          object.smoker = this.newUser.smoker;
          object.interests = this.newUser.interests;
          object.uid = this.newUser.uid;
          object.profilePic = this.newUser.profilePic;
          this.newUser = object;

    });
  }


  editInterestsComponent() {
    this.modalService.create({
        nzContent: EditInterestComponent,
        nzComponentParams: {
          entry: this.currentUser,
          current: this.newUser.interests,
          uid: this.newUser.uid
        },
    });
  }

  editBioComponent(){
    this.modalService.create({
      nzContent: EditBioComponent,
      nzComponentParams: {
        entry: this.currentUser,
        current: this.newUser.description,
        uid: this.newUser.uid
      },
    });
  }
    
  editPictureComponent(){
    this.modalService.create({
      nzContent: EditProfilePictureComponent,
      nzComponentParams: {
        entry: this.currentUser,
        current: this.email,
        uid: this.newUser.uid
      },
    });
  }

  editGeneralComponent() {

    const generalObject = {
      occupation: this.newUser.occupation,
      smoker: this.newUser.smoker,
      drinker:this.newUser.drinker,
      favMov:this.newUser.favoriteMovie,
      favSong:this.newUser.favoriteSong
    } 

    this.modalService.create({
      nzContent: EditGeneralComponent,
      nzComponentParams: {
        entry: this.currentUser,
        current: generalObject,
        uid: this.newUser.uid
      },
    });
  }

  isSmoker() {
    if(this.newUser.smoker === "smoker") {
      return "Yes";
    }
    else {
      return "No";
    }
  }

  isDrinker() {
    if(this.newUser.drinker === "drinker") {
      return "Yes";
    }
    else {
      return "No";
    }
  }
}
