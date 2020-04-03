import { Injectable, Query } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreModule, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: any;
  chatMessages;
  chatMessage: ChatMessage;
  userName: Observable<String>;
  currentUser;
  recieverUid;
  senderUid
  users: Array<User> = [];
  chatId1;
  chatId2;
  chatId;
  message;
  messages: Array<String> =[];

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ){
    this.afAuth.authState.subscribe(auth => {

      if(auth !== undefined && auth !== null){
        this.user = auth;
      }
    });

    this.currentUser = firebase.auth().currentUser;
    this.senderUid = this.currentUser.uid;
  }



  sendMessage(message){
    console.log(this.currentUser.uid);
    //this.chatMessages = this.db.collection('chats').doc(this.currentUser.uid);
    const timestamp = new Date().toLocaleString()
    const email = this.currentUser.email;
    //const email = "test@email";
    this.chatMessages = this.getMessages();
    this.db.collection('chats').doc(this.chatId).collection('messages').add({
      message: message,
      timeSent: timestamp,
      //userName: this.userName,
      sender: this.senderUid,
      reciever: this.recieverUid
    });

    console.log('Called sendMessage()');
  }

  displayUsers() {
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
          object.county =  doc.data().county;
          object.drinker = doc.data().drinker;
          object.maritalStatus = doc.data().maritalStatus;
          object.occupation = doc.data().occupation;
          object.smoker = doc.data().smoker;
          object.interests = doc.data().interests;
          object.uid = doc.data().uid;
          this.users.push(object);
        });
       });
       return this.users
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
         console.log(doc.id);
         if(doc.id === this.chatId1) {
           this.chatId = this.chatId1;
         }
         else if(doc.id === this.chatId2) {
           this.chatId = this.chatId2;
         }
         else {
           this.chatId = this.chatId1;
           this.createUser();
         }
       });
       console.log("chatId " + this.chatId);
      });
      this.getMessages();
  }

  createUser() {
    this.db.collection('chats').doc(this.chatId).set({chatId: this.chatId,
                                                      userId1: this.senderUid,
                                                      userId2: this.recieverUid});
  }

  setMessage(msg:string) {
    this.message = msg;
  }

  getMessages(){
    const snapshot = this.db.collection('chats').doc(this.chatId).collection('messages').get();
    snapshot.subscribe(snap => {
       snap.forEach(doc => {
          var data = doc.data();
          console.log(data.message);
          this.messages.push(data.message)
       });
      });
      return this.messages
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCDate();

    return (date);
  }
}




