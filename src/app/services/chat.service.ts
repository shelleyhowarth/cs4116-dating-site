import { Injectable, Query } from '@angular/core';
import { ChatMessage } from '../model/chat-message.model';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreModule, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';
import { Connection } from '../model/connections.model';


@Injectable({
  providedIn: 'root'
})

export class ChatService {

  user: any;
  chatMessages;
  chatMessage: ChatMessage;
  userName: Observable<String>;
  currentUser;
  receiverUid;
  senderUid
  users: Array<User> = [];
  chatId1;
  chatId2;
  chatId;
  message;
  messages: Array<String> =[];
  connections;
  searchId;
  userId = firebase.auth().currentUser.uid

  constructor( private db: AngularFirestore, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(auth => {

      if(auth !== undefined && auth !== null){
        this.user = auth;
      }
    });

    this.currentUser = firebase.auth().currentUser;
    this.senderUid = this.currentUser.uid;
  }

}