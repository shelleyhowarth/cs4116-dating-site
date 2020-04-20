import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { User } from '../model/user.model';
import { notification } from '../model/notification.model';
import { ChatService } from '../services/chat.service';
import { Connection } from 'src/app/model/connections.model';
import { Notification } from '../model/notifications.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId = firebase.auth().currentUser.uid
  connections: Array<Connection> = [];
  notifications: Array<Notification> = [];
  messageNotifications: Array<Notification> = [];
  users: Array<User> = [];
  connectedUserIds: Array<String> = [];
  searchId: Array<String> = [];
  connectedId: string;
  receiverId: any;
  allUsers: Array<User> = [];
  suggestedUsers: Array<User> = [];
  currentUser = null;
  uid = null;
  email = null;
  searchArray = [];
  noResults = true;
  connected: Boolean;


  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getConnections();
    this.getNotifications();
    this.getMessageNotifications();
  }

  getConnections() {
    var ref = this.db.collection("Connections").get();
    ref.subscribe(snap => {
      snap.forEach(doc => {
        let object = new Connection;
        var data = doc.data();
        if (doc.id.includes(this.userId) && data.accepted) {
          object.date = data.date;
          object.userId1 = data.userId1;
          object.userId2 = data.userId2;
          object.accepted = data.accepted
          this.connections.push(object);
        }
      });
      this.getConnectedUsers();
    });
  }

  getConnectedUsers() {
    var ref = this.db.collection("Users").get();

    this.connections.forEach(object => {
      if (object.userId1 === this.userId) {
        this.searchId.push(object.userId2);
      }
      else {
        this.searchId.push(object.userId1);
      }
    });

    this.searchId.forEach(id => {
      ref.subscribe(snap => {
        snap.forEach(doc => {
          if (doc.id === id) {
            let object = new User();
            object.firstName = doc.data().firstName;
            object.lastName = doc.data().lastName;
            object.age = doc.data().age;
            object.description = doc.data().description;
            object.gender = doc.data().gender;
            object.email = doc.data().email;
            object.favoriteSong = doc.data().favoriteSong;
            object.favoriteMovie = doc.data().favoriteMovie;
            object.county = doc.data().county;
            object.drinker = doc.data().drinker;
            object.maritalStatus = doc.data().maritalStatus;
            object.occupation = doc.data().occupation;
            object.smoker = doc.data().smoker;
            object.interests = doc.data().interests;
            object.uid = doc.data().uid;
            object.profilePic = doc.data().profilePic;
            this.users.push(object);

          }
        });
      });
    })
    this.getUserInfo();
  }

  getNotifications() {
    var ref = this.db.collection("notifications").get();
    ref.subscribe(snap => {
      snap.forEach(doc => {
        let object = new Notification;
        var data = doc.data();
        if (doc.id.includes(this.userId) && !(doc.data().seen)) {
          object.date = data.date;
          object.notification = data.notification;
          object.seen = data.seen;
          this.notifications.push(object);
        }
      });
    });
  }

  getMessageNotifications() {
    var ref = this.db.collection("notifications").get();
    ref.subscribe(snap => {
      snap.forEach(doc => {
        let object = new Notification;
        var data = doc.data();
        if (doc.id.includes(this.userId) && !(doc.data().seen)) {
          object.date = data.date;
          object.notification = data.messageNotifications;
          object.seen = data.seen;
          this.messageNotifications.push(object);
        }
      });
    });
  }
  getUsers() {
    const snapshot = this.db.collection('Users').get();
    snapshot.subscribe(snap => {
      snap.forEach(doc => {
        let object = new User();
        object.firstName = doc.data().firstName;
        object.lastName = doc.data().lastName;
        object.age = doc.data().age;
        object.description = doc.data().description;
        object.gender = doc.data().gender;
        object.email = doc.data().email;
        object.favoriteSong = doc.data().favoriteSong;
        object.favoriteMovie = doc.data().favoriteMovie;
        object.county = doc.data().county;
        object.drinker = doc.data().drinker;
        object.maritalStatus = doc.data().maritalStatus;
        object.occupation = doc.data().occupation;
        object.smoker = doc.data().smoker;
        object.interests = doc.data().interests;
        object.uid = doc.data().uid;
        object.profilePic = doc.data().profilePic;
        this.allUsers.push(object);
      });
      this.createSuggestion();
    });
  }

  getUserEmail() {
    this.currentUser = firebase.auth().currentUser;

    if (this.currentUser != null) {
      this.email = this.currentUser.email;
      this.uid = this.currentUser.uid;
    }
  }

  getUserInfo() {
    this.getUserEmail();
    var docRef = this.db.collection("Users").doc(this.uid).get();

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
      object.county = doc.data().county;
      object.drinker = doc.data().drinker;
      object.maritalStatus = doc.data().maritalStatus;
      object.occupation = doc.data().occupation;
      object.smoker = doc.data().smoker;
      object.interests = doc.data().interests;
      object.uid = doc.data().uid;
      object.profilePic = doc.data().profilePic;

      this.currentUser = object;
      console.log(this.currentUser.interests)

      this.getUsers();
    });
  }

  createSuggestion() {
    this.allUsers.forEach(user => {
      if (!this.users.some(u => u.email === user.email)) {
        let found = this.currentUser.interests.some((r: never) => user.interests.indexOf(r) >= 2);
        if (found == true) {
          if (this.currentUser.uid != user.uid) {
            this.suggestedUsers.push(user);
          }
        }
      }
    });
  }

  accept() {
    var docRef = this.db.collection("notifications").doc(this.userId).get();
    docRef.subscribe(doc => {
      this.connectedId = doc.data().connectionId;
      this.receiverId = doc.data().receiver;
      this.updateDb(true);
    });
  }

  reject() {
    var docRef = this.db.collection("notifications").doc(this.userId).get();
    docRef.subscribe(doc => {
      this.connectedId = doc.data().connectionId;
      this.receiverId = doc.data().receiver;
      this.updateDb(false);
    });
  }

  updateDb(acceptStatus: boolean) {
    var ref = this.db.collection("Connections").doc(this.connectedId);
    ref.update({
      accepted: acceptStatus
    });

    var ref2 = this.db.collection("notifications").doc(this.userId);
    ref2.update({
      seen: true
    });
  }
}







