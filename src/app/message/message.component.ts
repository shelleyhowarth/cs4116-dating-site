import { Component, OnInit, Input } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';
import * as firebase from "firebase";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreModule, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() chatMessage: ChatMessage;

  userName: string;
  messageContent: string;
  timeStamp: Date = new Date();


  constructor() { }

  ngOnInit(chatMessage = this.chatMessage): void {
    this.messageContent = chatMessage.message;
    this.timeStamp = chatMessage.timeSent;
    this.userName = chatMessage.userName;

  }
  

}
