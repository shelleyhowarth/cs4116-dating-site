import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { User } from '../model/user.model';
import { notification } from '../model/notification.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  userId = firebase.auth().currentUser.uid
  notifications: Array<notification> = [];
  users: Array<User> = [];
  connectedUserIds: Array<String> = [];
  searchId: Array<String> = [];
  connectedId;
  chatId;
  reciever;
  senderUid = this.userId;
  receiverId;
  
  constructor(private db: AngularFirestore,private chat: ChatService) { }

  ngOnInit(): void {
    this.getNotifications();
    this.users = this.chat.displayUsers();
  }

  
  checkForUser(secondUser) {
    this.reciever = secondUser.uid;
  }

  getNotifications() {
  
    var ref = this.db.collection("notifications").get();
    ref.subscribe(snap => {
      snap.forEach(doc => {
        let object = new notification;
        var data = doc.data();
        console.log("user id = " + this.userId + "doc id" + doc.id);
        if (doc.id.includes(this.userId) && !(doc.data().seen)) {
          object.timeSent = data.date;
          object.senderName = 
          object.notification = data.notification;
          object.seen = data.seen;
          this.notifications.push(object);
        }
      });
    });
  }

  submit() {
    var docRef = this.db.collection("notification").doc(this.userId).get();
    docRef.subscribe(doc => {
      this.chatId = doc.data().receiver;
      this.receiverId = doc.data().receiver;
      this.updateDb();
    });

  }

  getName(user) {
    return user.firstName;
  }

  onClick(user) {
    this.checkForUser(user);
    
    this.users = [];
    console.log(user.uid);
    this.reciever = user;
  }

  updateDb() {
    const time = new Date().toLocaleString();

    var ref2 = this.db.collection("notifications").doc(this.userId);
    ref2.update({
      seen: true
    });
  }
}
