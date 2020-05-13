import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'src/app/model/user.model';
import * as firebase from 'firebase';
import { NzModalService } from 'ng-zorro-antd';
import { EditInterestComponent } from '../my-profile/edit-profile/edit-interest/edit-interest.component';
import { EditBioComponent } from '../my-profile/edit-profile/edit-bio/edit-bio.component';
import { EditProfilePictureComponent } from '../my-profile/edit-profile/edit-profile-picture/edit-profile-picture.component';
import { EditGeneralComponent } from '../my-profile/edit-profile/edit-general/edit-general.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  otherUserId;
  currentId = firebase.auth().currentUser.uid;
  currentUser;
  user;
  avatarUrl;
  noConnection = false;
  connectionPending = false;
  connectionAccepted = false;
  isAdmin = false;
  hideAdminBtn = false; 

  constructor(private router: Router, private db: AngularFirestore, public afAuth: AngularFireAuth, private modalService: NzModalService) { }

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

    this.db.collection('Users').doc(this.otherUserId).valueChanges().subscribe(doc => {
      this.user = doc;
      var object1 = new User();
        object1.firstName = this.user.firstName;
        object1.lastName = this.user.lastName;
        object1.age = this.user.age;
        object1.description = this.user.description;
        object1.gender = this.user.gender;
        object1.email = this.user.email;
        object1.favoriteSong = this.user.favoriteSong;
        object1.favoriteMovie = this.user.favoriteMovie;
        object1.county = this.user.county;
        object1.drinker = this.user.drinker;
        object1.maritalStatus = this.user.maritalStatus;
        object1.occupation = this.user.occupation;
        object1.smoker = this.user.smoker;
        object1.interests = this.user.interests;
        object1.uid = this.user.uid;
        object1.profilePic = this.user.profilePic;
        object1.admin = this.user.admin;
        object1.disabled = this.user.disabled;
        this.user = object1;
    });

    this.db.collection('Users').doc(this.currentId).valueChanges().subscribe(doc => {
      this.currentUser = doc;
      var object = new User();
      object.firstName = this.currentUser.firstName;
        object.lastName = this.currentUser.lastName;
        object.age = this.currentUser.age;
        object.description = this.currentUser.description;
        object.gender = this.currentUser.gender;
        object.email = this.currentUser.email;
        object.favoriteSong = this.currentUser.favoriteSong;
        object.favoriteMovie = this.currentUser.favoriteMovie;
        object.county = this.currentUser.county;
        object.drinker = this.currentUser.drinker;
        object.maritalStatus = this.currentUser.maritalStatus;
        object.occupation = this.currentUser.occupation;
        object.smoker = this.currentUser.smoker;
        object.interests = this.currentUser.interests;
        object.uid = this.currentUser.uid;
        object.profilePic = this.currentUser.profilePic;
        object.admin = this.currentUser.admin;
        object.disabled = this.currentUser.disabled;
        this.currentUser = object;
      
        this.isAdmin = this.currentUser.admin
      });
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

    var ref2 = this.db.collection("notifications").doc(docId);
    ref2.set({
      date: time,
      notification: (this.currentUser.firstName + " wants to connect with you."),
      seen: false,
      isConnection: true,
      connectionId: docId,
      sender: this.currentId,
      receiver: this.otherUserId
    });

    this.noConnection = false;
    this.connectionPending = true;
  }

  disableAccount() { 
    this.db.collection('Users').doc(this.otherUserId).update({ disabled: true });
    window.alert("Account disabled");
  }

  reEnableAccount() {
    this.db.collection('Users').doc(this.otherUserId).update({ disabled: false });
    window.alert("Account re-enabled");
  }

  deleteAccount() {
    this.db.collection('Users').doc(this.otherUserId).delete();

    var docRef = this.db.collection("Connections").get();
    docRef.subscribe(snap => {
      snap.forEach(doc => {
        if (doc.id.includes(this.otherUserId)) {
          var ref = this.db.collection("Connections").doc(doc.id).delete();
        }
      });
    });

    var docRef2 = this.db.collection("chats").get();
    docRef2.subscribe(snap => {
      snap.forEach(doc => {
        if (doc.id.includes(this.otherUserId)) {
          var ref = this.db.collection("chats").doc(doc.id).delete();
        }
      });
    });
    window.alert("Account successfully deleted");
  }

  deleteConnection(){
    var docId = this.currentId + this.otherUserId;
    var ref = this.db.collection("Connections").doc(docId);
    ref.delete();

    var ref = this.db.collection("chats").doc(docId);
    ref.delete();

    var docIdNot = this.currentId;
    this.db.collection("notifications").doc(docIdNot).update({
      seen: true
    });
    
    var docId2= this.otherUserId + this.currentId;
    var ref = this.db.collection("Connections").doc(docId2)
    ref.delete();

    var ref = this.db.collection("chats").doc(docId2);
    ref.delete();

    var docIdNot2 = this.otherUserId;
    this.db.collection("notifications").doc(docIdNot2).update({
      seen: true
    });
  
    this.noConnection = true;
    this.connectionPending = false;
    this.connectionAccepted = false;
    window.alert("You have disconnected with " + this.user.firstName);
  }
    
  editInterestsComponent() {
    this.modalService.create({
      nzContent: EditInterestComponent,
      nzComponentParams: {
        entry: this.user,
        current: this.user.interests,
        uid: this.user.uid
      },
    });
  }

  editBioComponent() {
    this.modalService.create({
      nzContent: EditBioComponent,
      nzComponentParams: {
        entry: this.user,
        current: this.user.description,
        uid: this.user.uid
      },
    });
  }

  editPictureComponent() {
    this.modalService.create({
      nzContent: EditProfilePictureComponent,
      nzComponentParams: {
        entry: this.currentUser,
        current: this.user.email,
        uid: this.user.uid
      },
    });
  }

  editGeneralComponent() {

    const generalObject = {
      occupation: this.user.occupation,
      smoker: this.user.smoker,
      drinker: this.user.drinker,
      favMov: this.user.favoriteMovie,
      favSong: this.user.favoriteSong
    }

    this.modalService.create({
      nzContent: EditGeneralComponent,
      nzComponentParams: {
        entry: this.currentUser,
        current: generalObject,
        uid: this.user.uid
      },
    });
  }

  isSmoker() {
    if(this.user.smoker === "true") {
      return "Yes";
    }
    else {
      return "No";
    }
  }

  isDrinker() {
    if(this.user.drinker === "true") {
      return "Yes";
    }
    else {
      return "No";
    }
  }

  makeAdmin(uid) {
    this.db.collection("Users").doc(uid).update({
      admin: true
    });
    window.alert(this.user.firstName + " has been made an admin.");
    this.hideAdminBtn = true;
  }
}