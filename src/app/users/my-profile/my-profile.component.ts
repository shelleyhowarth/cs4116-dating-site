import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from "../../model/user.model";
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { UsersService } from '../../services/users.service';
import { AngularFirestore, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { NzModalService, NzMessageService} from 'ng-zorro-antd';
import { InterestsComponent } from '../../login/sign-up/interests/interests.component';
import { EditInterestComponent } from './edit-profile/edit-interest/edit-interest.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EditBioComponent } from './edit-profile/edit-bio/edit-bio.component';
import { EditProfilePictureComponent } from './edit-profile/edit-profile-picture/edit-profile-picture.component';

  @Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss']
  })

export class MyProfileComponent implements OnInit {

  user =null;
  users: Array<User> = [];
  uid = null;
  email= null;
  avatarUrl:string;
  firstName;
  age = {};
  county = {};
  bio = {};
  newUser;
  projects: QueryDocumentSnapshot<User>;

  interests = ["Reading", "Gardening", "Painting", "Baking"];
  
  constructor(
    private usersService: UsersService,
     private firestore: AngularFirestore,
    private modalService: NzModalService,
    private msg: NzMessageService,
  ){}

  ngOnInit(): void {
    this.getUserInfo();
  }
  
  getCurrentUser(){
    return this.user = firebase.auth().currentUser;
  }

  getUserEmail(){
   this.getCurrentUser();

    if(this.user != null){
      this.email = this.user.email;
      this.uid = this.user.uid;
      console.log(this.uid);
    }
  }
  
  getUserInfo(){
    this.getUserEmail();
    var docRef = this.firestore.collection("Users").doc(this.uid).valueChanges();
    
    console.log(docRef);
    docRef.subscribe(doc => {
          console.log("Document data:", doc);

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
          console.log(this.newUser);
    });

  }

  createInterestsComponent() {
    this.modalService.create({
        nzContent: EditInterestComponent,
        nzComponentParams: {
          entry: this.getCurrentUser(),
          current: this.newUser.interests
        },
    });
  }

  editBioComponent(){
    this.modalService.create({
      nzContent: EditBioComponent,
      nzComponentParams: {
        entry: this.getCurrentUser(),
        current: this.newUser.description
      },
    });
  }
    

    editPictureComponent(){
    this.modalService.create({
      nzContent: EditProfilePictureComponent,
      nzComponentParams: {
        entry: this.getCurrentUser(),
        current: this.email
      },
    });
  }

  isSmoker() {
    if(this.user.smoker === "smoker") {
      return "Yes";
    }
    else {
      return "No";
    }
  }

  isDrinker() {
    if(this.user.drinker === "drinker") {
      return "Yes";
    }
    else {
      return "No";
    }
  }
}
