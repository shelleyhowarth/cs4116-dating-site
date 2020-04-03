import { Injectable, Query } from '@angular/core';
import { ChatMessage } from '../model/chat-message.model';
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

  displayUsers() {
    this.users = [];
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
}




