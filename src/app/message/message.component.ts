import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../model/chat-message.model';
import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../services/chat.service';
import { User } from '../model/user.model';
import { Connection } from '../model/connections.model';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  message: string;
  users: Array<User> = [];
  chatId;
  chatId1;
  chatId2;
  receiverUid;
  currentUser = firebase.auth().currentUser;
  senderUid = this.currentUser.uid;
  userSelected: boolean = false;
  receiver;
  messages: Array<ChatMessage>;
  avatarUrl;
  connections: Array<Connection> = [];
  searchId: Array<String> = [];

  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
   this.getConnections();
   console.log(this.users);
  }

  getConnections() {
    var ref = this.db.collection("Connections").get();
    ref.subscribe(snap => {
      snap.forEach(doc => {
        let object = new Connection;
        var data = doc.data();
        if (doc.id.includes(this.currentUser.uid) && data.accepted) {
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
      if (object.userId1 === this.currentUser.uid) {
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
    return this.users;
  }

  send(){
    this.sendMessage(this.message);
    this.message = '';
    this.getMessages();
  }

  sendMessage(message){
    console.log(this.currentUser.uid);
    const timestamp = new Date().toLocaleString()
    this.db.collection('chats').doc(this.chatId).collection('messages').add({
      message: message,
      timeSent: timestamp,
      sender: this.senderUid,
      receiver: this.receiverUid
    });
    console.log('Called sendMessage()');
  }

  handleSubmit(event){
    if(event.keycode === 13){
      this.send();
    }
  }

  onClick(user) {
    this.checkForUser(user);
    this.userSelected = true;
    this.users = [];
    console.log(user.uid);
    this.receiver = user;
  }

  checkForUser(secondUser) {
    this.receiverUid = secondUser.uid;
    this.chatId1 = this.senderUid + this.receiverUid;
    this.chatId2 = this.receiverUid + this.senderUid;
    console.log("Chat 1" + this.chatId1);
    console.log("Chat 2" + this.chatId2);

    const snapshot = this.db.collection('chats').get();
    snapshot.subscribe(snap => {
       snap.forEach(doc => {
         if(doc.id === this.chatId1) {
           this.chatId = this.chatId1;
           this.messages = this.getMessages();
         }
         else if(doc.id === this.chatId2) {
           this.chatId = this.chatId2;
           this.messages = this.getMessages();
         }
         else {
           this.chatId = this.chatId1;
           this.createUser();
         }
       });
       console.log("chatId " + this.chatId);
      });
  }

  createUser() {
    this.db.collection('chats').doc(this.chatId).set({chatId: this.chatId,
                                                      userId1: this.senderUid,
                                                      userId2: this.receiverUid});
  }

  getMessages(){
    this.messages = [];
    const snapshot = this.db.collection('chats').doc(this.chatId).collection('messages').get();
    snapshot.subscribe(snap => {
       snap.forEach(doc => {
        var data = doc.data();
         let object = new ChatMessage;
         object.userUid = data.sender;
         object.message = data.message;
         object.timeSent = new Date(data.timeSent);
         if(object.userUid === this.senderUid) {
           object.sendSelf = true;
         }
         else {
           object.sendSelf = false;
         }
         this.messages.push(object);
       });
       this.sortByDate();
    });
    return this.messages;
  }

  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  public sortByDate(): void {
    this.messages.sort((a: ChatMessage, b: ChatMessage) => {
         return this.getTime(a.timeSent) - this.getTime(b.timeSent);
    });
    console.log("ordered" + this.messages)
  }

}