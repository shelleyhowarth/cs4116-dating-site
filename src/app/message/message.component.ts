import { Component, OnInit } from '@angular/core';
import { ChatMessage } from '../model/chat-message.model';
import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../services/chat.service';
import { User } from '../model/user.model';


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

  constructor(private db: AngularFirestore,private chatService: ChatService) { }

  ngOnInit(): void {
    this.users = this.chatService.displayUsers();
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
        console.log(data);
         let object = new ChatMessage;
         object.userUid = data.sender;
         object.message = data.message;
         object.timeSent = new Date(data.timeSent);
         this.messages.push(object);
       });
    });
    this.sortByDate();
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