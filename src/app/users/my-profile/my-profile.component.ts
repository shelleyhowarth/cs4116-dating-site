import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { User } from "../../model/user.model";
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { UsersService } from '../../services/users.service';
import { AngularFirestore } from '@angular/fire/firestore';

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
  newUser: User = null;

  interests = ["Reading", "Gardening", "Painting", "Baking"];
  
  constructor(private usersService: UsersService, private firestore: AngularFirestore){
    
  }

  getUserEmail(){
    this.user = firebase.auth().currentUser;

    if(this.user != null){
      this.email = this.user.email;
      this.uid = this.user.uid;
      console.log(this.uid);
    }
  }
  
  setProfilePicture(){
    this.getUserEmail();
    var picLocation = "profilePics/"  + this.email;
    console.log(picLocation);
    var picRef = firebase.storage().ref(picLocation);
    
    picRef.getDownloadURL().then(picUrl => {
      this.avatarUrl = picUrl;
    });
  }

  getUserInfo(){
    this.getUserEmail();
    var docRef = this.firestore.collection("Users").doc(this.uid).get();
    console.log(docRef);

    docRef.subscribe(doc => {
          console.log("Document data:", doc.data());

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

          this.newUser = object;
          console.log(this.newUser);
    });

  }

  setProfileDetails(){
    this.getUserInfo();

    console.log
    
  }

  
  getName() {
    return this.newUser.firstName;
  }

  getAge() {
    return this.newUser.age;
  }

  getCounty() {
    return this.newUser.county;
  }

  getBio() {
    return this.newUser.description;
  }

  getInterests() {
    return this.newUser.interests;
  }

  ngOnInit(): void {
    this.setProfilePicture();
    this.setProfileDetails();
  }

}
