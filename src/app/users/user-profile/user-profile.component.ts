import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'src/app/model/user.model';
import * as firebase from 'firebase';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  otherUserId;
  currentId = firebase.auth().currentUser.uid;
  currentUser;
  user: User;
  avatarUrl;
  noConnection = false;
  connectionPending = false;
  connectionAccepted = false;
  isAdmin = false;

  constructor(private route: ActivatedRoute, private router: Router, private db: AngularFirestore, public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.otherUserId = this.router.url.substring(this.router.url.indexOf("=") + 1, this.router.url.length);

    var docId = this.currentId + this.otherUserId;
    var docId2 = this.otherUserId + this.currentId;
    var collectionRef = this.db.collection("Connections").get();

    collectionRef.subscribe(res => {
      res.forEach(doc => {
        if(doc.id === docId || doc.id === docId2) {
          if(doc.data().accepted == true) {
            this.connectionAccepted = true;
            this.connectionPending = false;
            this.noConnection = false;
          }
          else {
            this.connectionPending = true;
            this.connectionAccepted = false;
            this.noConnection = false;
          }
        }
        else if(this.connectionAccepted === false && this.connectionPending === false) {
          this.noConnection = true;
        }
      })
      
    })



    this.db.collection('Users').doc(this.otherUserId).get().subscribe( doc => {
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
          uid: doc.data().uid,
          profilePic: doc.data().profilePic,
          admin: doc.data().admin
        };
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
        uid: doc.data().uid,
        profilePic: doc.data().profilePic,
        admin: doc.data().admin
      };
      this.isAdmin = this.currentUser.admin
      console.log(this.isAdmin);
    })

  }

  sendConnectRequest() {
    const time = new Date().toLocaleString();
    var docId = this.currentId + this.otherUserId;

    var ref = this.db.collection("Connections").doc(docId);
    ref.set({
      userId1: this.currentId,
      userId2: this.otherUserId,
      date: time,
      accepted: false
    });
    window.alert("Your connection request has been sent to " + this.user.firstName);

    var ref2 = this.db.collection("notifications").doc(this.otherUserId);
    ref2.set({
      date: time,
      notification: (this.currentUser.firstName + " wants to connect with you."),
      seen: false,
      connectionId: docId,
      sender: this.currentId,
      receiver: this.otherUserId
    });

    this.noConnection = false;
    this.connectionPending = true;
  }

  disableAccount() {
    
  }

  deleteAccount() {

    this.afAuth.idToken.subscribe(user => {
      
    })
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user.uid);
      if (user.uid === this.otherUserId) {
        user.delete();
        console.log(user.uid);
        this.db.collection("Users").doc(this.otherUserId).delete();
      } else {
        console.log("Delete unsuccessful")
      }
    });
  }
}