import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user =null;
  email = null;
  avatarUrl:string;

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

  
  

  ngOnInit(): void {
    this.setProfilePicture();
  }

}
