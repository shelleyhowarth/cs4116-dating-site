import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { Connection } from 'src/app/model/connections.model';
import { User } from '../model/user.model';
import { Notification} from '../model/notifications.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId = firebase.auth().currentUser.uid
  connections: Array<Connection> = [];
  notifications: Array<Notification> = [];
  users: Array<User> = [];
  connectedUserIds: Array<String> = [];
  searchId: Array<String> = [];
  connectedId;
  receiverId;

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getConnections();
    this.getNotifications();
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
        else {
          console.log("no connections");
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
            this.users.push(object);
          }
        });
      });
    })
  }

  getNotifications() {
    var ref = this.db.collection("notifications").get();
    ref.subscribe(snap => {
      snap.forEach(doc => {
        let object = new Notification;
        var data = doc.data();
        console.log("user id = " + this.userId + "doc id" + doc.id);
        if (doc.id.includes(this.userId) && !(doc.data().seen)) {
          object.date = data.date;
          object.notification = data.notification;
          object.seen = data.seen;
          this.notifications.push(object);
        }
      });
    });
  }

  submit() {
    var docRef = this.db.collection("notifications").doc(this.userId).get();
    docRef.subscribe(doc => {
      this.connectedId = doc.data().connectionId;
      this.receiverId = doc.data().receiver;
      this.updateDb();
    });

  }

  updateDb() {
    const time = new Date().toLocaleString();

    var ref = this.db.collection("Connections").doc(this.connectedId);
    ref.update({
      accepted: true
    });

    var ref2 = this.db.collection("notifications").doc(this.userId);
    ref2.update({
      seen: true
    });
  }
}
