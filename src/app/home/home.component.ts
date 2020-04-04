import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatMessage } from '../model/chat-message.model';
import { User } from '../model/user.model';
import { ChatService } from '../services/chat.service';
import * as firebase from "firebase";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  message: string;
  users:  Array<User> = [];
  chatId;
  chatId1;
  chatId2;
  recieverUid;
  currentUser = firebase.auth().currentUser;
  senderUid = this.currentUser.uid;
  userSelected: boolean = false;
  reciever;
  messages: Array<ChatMessage>

  constructor(private db: AngularFirestore,private chat: ChatService) { }

  ngOnInit(): void {
    this.users = this.chat.displayUsers();
  }

  send(){
    this.sendMessage(this.message);
    this.message = '';
    this.getMessages();
  }

  sendMessage(message){
    console.log(this.currentUser.uid);
    const timestamp = new Date().toLocaleString()
    const email = this.currentUser.email;
    //this.chatMessages = this.getMessages();
    this.db.collection('chats').doc(this.chatId).collection('messages').add({
      message: message,
      timeSent: timestamp,
      sender: this.senderUid,
      reciever: this.recieverUid
    });
    console.log('Called sendMessage()');
  }


  getName(user) {
    return user.firstName;
  }


  onClick(user) {
    this.checkForUser(user);
    this.userSelected = true;
    this.users = [];
    console.log(user.uid);
    this.reciever = user;
  }

  checkForUser(secondUser) {
    this.recieverUid = secondUser.uid;
    this.chatId1 = this.senderUid + this.recieverUid;
    this.chatId2 = this.recieverUid + this.senderUid;
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
       });
       console.log("chatId " + this.chatId);
      });
  }


  getMessages(){
    this.messages = [];
    const snapshot = this.db.collection('chats').doc(this.chatId).collection('messages').get();
    snapshot.subscribe(snap => {
       snap.forEach(doc => {
        var data = doc.data();
        console.log(data);
         let object = new ChatMessage;
         object.userUid = data.sender;
         object.message = data.message;
         object.timeSent = data.timeSent;
         console.log(object);
         this.messages.push(object);
       });
      });
      return this.messages;
  }
}