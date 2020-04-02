import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { User } from "../model/user.model";
import { Variable } from '@angular/compiler/src/render3/r3_ast';

  @Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss']
  })

export class MyProfileComponent implements OnInit {
  user =null;
  email = null;
  avatarUrl:string;
  firstName :string;
  age: string;
  county:string;
  bio:string;
  userDetails = null;

  interests = ["Reading", "Gardening", "Painting", "Baking"];
  
  constructor(){
    
  }

  getUserEmail(){
    this.user = firebase.auth().currentUser;

    if(this.user != null){
      this.email = this.user.email;
      console.log(this.email);
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
    const db = firebase.firestore()
    this.getUserEmail();
    var docRef = db.collection("Users").doc(this.email);
    console.log(docRef);

    docRef.get().then(function(doc) {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          
          var data = doc.data();

          const details = new User(data.FirstName, data.LastName, data.email,data.age,
            data.Gender,data.Description,data.county,data.occupation,data.martialStatus,
            data.smoker,data.drinker,data.FavouriteSong,data.FavouriteMovie)

          this.userDetails = details;

          console.log(this.userDetails);


      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
  
  }

  setProfileDetails(){
    this.getUserInfo();
  }

  


  ngOnInit(): void {
    this.setProfilePicture();
    this.setProfileDetails();
  }

}
