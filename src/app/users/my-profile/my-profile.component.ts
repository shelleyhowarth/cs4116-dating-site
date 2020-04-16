import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from "../../model/user.model";
import { AngularFirestore } from '@angular/fire/firestore';
import { NzModalService } from 'ng-zorro-antd';
import { EditInterestComponent } from './edit-profile/edit-interest/edit-interest.component';
import { EditBioComponent } from './edit-profile/edit-bio/edit-bio.component';
import { EditProfilePictureComponent } from './edit-profile/edit-profile-picture/edit-profile-picture.component';

  @Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss']
  })

export class MyProfileComponent implements OnInit {
  users: Array<User> = [];
  uid;
  email;
  avatarUrl: string;
  newUser: User;
  currentUser = firebase.auth().currentUser;


  interests = ["Reading", "Gardening", "Painting", "Baking"];
  
  constructor(private firestore: AngularFirestore, private modalService: NzModalService){ }

  ngOnInit(): void {
    this.getUserInfo();
    console.log(this.currentUser.uid);
  }

  getUserEmail(){
    if(this.currentUser != null){
      this.email = this.currentUser.email;
      this.uid = this.currentUser.uid;
    }
  }
   
  getUserInfo(){
    this.getUserEmail();
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
          object.county =  doc.data().county;
          object.drinker = doc.data().drinker;
          object.maritalStatus = doc.data().maritalStatus;
          object.occupation = doc.data().occupation;
          object.smoker = doc.data().smoker;
          object.interests = doc.data().interests;
          object.uid = doc.data().uid;
          object.profilePic = doc.data().profilePic;
          this.newUser = object;
    });
  }

  editPictureComponent(){
      this.modalService.create({
        nzContent: EditProfilePictureComponent,
        nzComponentParams: {
          entry: this.newUser,
          current: this.newUser.email
        }
    });
  }

  createInterestsComponent() {
    this.modalService.create({
        nzContent: EditInterestComponent,
        nzComponentParams: {
          entry: this.newUser,
          current: this.newUser.interests
        }
    });
  }

  editBioComponent(){
    this.modalService.create({
      nzContent: EditBioComponent,
      nzComponentParams: {
        entry: this.newUser,
        current: this.newUser.description
      },
    });
  }
}