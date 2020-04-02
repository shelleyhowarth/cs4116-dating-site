import { Injectable, Query } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreModule, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from "firebase";
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: any;
  chatMessages:  AngularFirestoreCollection<any> = this.db.collection('chats');
  chatMessage: ChatMessage;
  userName: Observable<String>;

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth
  ){
    this.afAuth.authState.subscribe(auth => {

      if(auth !== undefined && auth !== null){
        this.user = auth;
      }
    });
  }



  sendMessage(msg: string){

    const timestamp = this.getTimeStamp();
    //const email = this.user.email;
    const email = "test@email";
    this.chatMessages = this.getMessages();
    this.chatMessages.add({
      message: msg,
      timeSent: timestamp,
      //userName: this.userName,
      userName: "test-userName",
      email: email
    });

    console.log('Called senMessage()');
  }

  getMessages(){

    //Query to find chats
     
    return this.db.collection<any>('chats');
    
  }

  getTimeStamp(){
    const now = new Date();
    const date = now.getUTCDate();

    return (date);
  }
}




