import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { User } from '../model/user.model';
import { Connection } from 'src/app/model/connections.model';
import { Notification } from '../model/notifications.model';
import { Router } from '@angular/router';

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
  

  constructor(private db: AngularFirestore,   public router: Router) { }

  ngOnInit(): void {
    this.getConnections();
    this.getNotifications();

    this.uid = firebase.auth().currentUser.uid;
    sessionStorage.setItem('userName', this.userId);
   
  }

  getConnections() {
    this.connections = [];
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
    this.users = [];
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
            object.admin = doc.data().admin;
            this.users.push(object);
          }
        });
      });
    })
    this.getUserInfo();
  }

  getNotifications() {
    var ref2 = this.db.collection("notifications").get();

    ref2.subscribe(snap => {
      snap.forEach(doc => {
        let object = new Notification;
        var data = doc.data();

        if(doc.data().isConnection == true && (doc.id.includes(this.userId) && (data.seen == false) && (this.userId != data.sender) &&(doc.data().connectionId.includes(this.userId)))){

          object.date = data.date;
          object.notification = data.notification;
          object.seen = data.seen;
          object.connectionId = doc.id;
          console.log(object.connectionId);
          this.notifications.push(object);
        }
        else if(doc.data().isConnection == false  && (doc.id.includes(this.userId) && (doc.id == data.receiver) && (doc.id != data.sender) && (data.seen == false))){
          object.date = data.date;
          object.notification = data.notification;
          object.seen = data.seen;
          object.receiver = data.receiver;
          object.sender = data.sender;
          this.messageNotifications.push(object);
        }
       console.log(this.messageNotifications);
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

  updateUsers(search) {
    var ref = this.db.collection("Users");
    console.log("search " + search);
    ref.doc(search).get().subscribe(doc => {
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
    });
  }

  accept(id, index) {
    
    var docRef2 = this.db.collection("Connections").doc(id).get();
    var id1, id2, search;  
    docRef2.subscribe(doc => {
      let object = new Connection;
      var data = doc.data();
      object.date = data.date;
      object.userId1 = data.userId1;
      object.userId2 = data.userId2;
      object.accepted = data.accepted
      this.connections.push(object);
      id1 = object.userId1;
      id2 = object.userId2
      if (id1 === this.uid)
        search = id2;
      else
        search = id1
      this.updateUsers(search);
    });  
    this.db.collection("notifications").doc(id).update({
      seen: true
    });
    this.notifications
    this.notifications.splice(index, 1);

    this.db.collection("Connections").doc(id).update({
      accepted: true
    }); 
    window.alert("You have accepted the request");
  }

  reject(id, index) {
    var docRef = this.db.collection("notifications").doc(id).update({
      seen: true
    });
    this.notifications.splice(index, 1);
    var docRef2 = this.db.collection("Connections").doc(id).delete();
    window.alert("You have rejected the request");
  }

  discardedNotification(index) {
    var docRef = this.db.collection("notifications").doc(this.userId).update({
      seen: true
    })
    this.messageNotifications.splice(index, 1);
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

  updateDbNotif(discardStatus: boolean) {
    var ref = this.db.collection("notifications").doc(this.userId);
    ref.update({
      seen: true
    });
  }
    refreshHome(){
      window.location.reload();
      this.router.navigate(['Home']);
    }
  }

