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
  currentUser;
  user: User;
  avatarUrl;
  connectionExists = false;
  constructor(private route: ActivatedRoute, private router: Router, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.id = this.router.url.substring(this.router.url.indexOf("=") + 1, this.router.url.length);

    var docId = this.currentId + this.id;
    var ref = this.db.collection("Connections").doc(docId).get();
    console.log(ref);
    ref.subscribe(doc => {
      if (doc.exists) {
        console.log("Connection Exists")
        this.connectionExists = false;
      }
      else {
        console.log("no connection")
        this.connectionExists = true;
      }
    });

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
    this.db.collection('Users').doc(this.currentId).get().subscribe(doc => {
      this.currentUser = {
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
      date: time,
      accepted: false
    });
    console.log(ref);
    window.alert("Your connection request has been sent to " + this.user.firstName);

    var ref2 = this.db.collection("notifications").doc(this.id);
    ref2.set({
      date: time,
      notification: (this.currentUser.firstName + " wants to connect with you."),
      seen: false,
      connectionId: docId,
      sender: this.currentId,
      receiver: this.id
    });
  }
}
