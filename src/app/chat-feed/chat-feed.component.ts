import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatMessage } from '../models/chat-message.model';
import * as firebase from "firebase";
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestoreModule, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.scss']
})
export class ChatFeedComponent implements OnInit, OnChanges {

  feed: AngularFirestoreCollection<any> = this.db.collection('chats');

  constructor(private chat: ChatService, private db: AngularFirestore) { }

  ngOnInit(): void {
    this.feed = this.chat.getMessages();
  }

  ngOnChanges(): void{
    this.feed = this.chat.getMessages();
  }

}
