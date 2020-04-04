import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/model/user.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  id;
  currentId = firebase.auth().currentUser.uid;
  user: User;
  avatarUrl;
  constructor(private route: ActivatedRoute, private router: Router, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.id = this.router.url.substring(this.router.url.indexOf("=") + 1, this.router.url.length);
    this.db.collection('Users').doc(this.id).get().subscribe( doc => {
        this.user = {  
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          age: doc.data().age,
          description: doc.data().description,
          gender: doc.data().gender,
          email: doc.data().email,
          favoriteSong: doc.data().favoriteSong,
          favoriteMovie: doc.data().favoriteMovie,
          county: doc.data().county,
          drinker: doc.data().drinker,
          maritalStatus: doc.data().maritalStatus,
          occupation: doc.data().occupation,
          smoker: doc.data().smoker,
          interests: doc.data().interests,
          uid: doc.data().uid 
        };
        console.log(this.user.email);
        this.setProfilePicture();
      })
  }

  setProfilePicture(){
    var picLocation = "profilePics/"  + this.user.email;
    var picRef = firebase.storage().ref(picLocation);
    
    picRef.getDownloadURL().then(picUrl => {
      this.avatarUrl = picUrl;
    });
  }

  submit() {
    const time = new Date().toLocaleString();
    var docId = this.currentId + this.id;
    var ref = this.db.collection("Connections").doc(docId);
    ref.set({
      userId1: this.currentId,
      userId2: this.id,
      date: time
    });
    console.log(ref);
    window.alert("You have connected with " + this.user.firstName);
  }
}
