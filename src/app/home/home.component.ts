import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { Connection } from 'src/app/model/connections.model';
import { User } from '../model/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId = firebase.auth().currentUser.uid
  connections: Array<Connection> = [];
  users: Array<User> = [];
  connectedUserIds: Array<String> = [];
  searchId: Array<String> = [];

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.getConnections();
  }

  getConnections() {
    var ref = this.db.collection("Connections").get();
    ref.subscribe(snap => {
      snap.forEach(doc => {
        let object = new Connection;
        var data = doc.data();
        console.log("user id = " + this.userId + "doc id" + doc.id);
        if (doc.id.includes(this.userId)) {
          object.date = data.date;
          object.userId1 = data.userId1;
          object.userId2 = data.userId2;
          this.connections.push(object);
        }
        else {
          console.log("no connections");
        }
      });
      console.log(this.connections);
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
    console.log(this.searchId)

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
    console.log(this.users);
  }
}
