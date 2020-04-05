import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { User } from '../../model/user.model';
import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatMessage } from '../../model/chat-message.model'
@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {

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
  messages: Array<ChatMessage>;
  avatarUrl;

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

  handleSubmit(event){
    if(event.keycode === 13){
      this.send();
    }
  }

  getName(user) {
    return user.firstName;
  }

  getAgeAndLocation(user) {
    return " " + user.age + ", " + user.county + " ";
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
                                                      userId2: this.recieverUid});
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
         //console.log(object);
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
         //console.log(this.getTime(a.timeSent) - this.getTime(b.timeSent));
         return this.getTime(a.timeSent) - this.getTime(b.timeSent);
    });
    console.log("ordered" + this.messages)
  }

  setProfilePicture(user){
    var picLocation = "profilePics/"  + user.email;
    var picRef = firebase.storage().ref(picLocation);
    
    picRef.getDownloadURL().then(picUrl => {
      this.avatarUrl = picUrl;
    });
    return this.avatarUrl;
  }
}
