import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {

  message: string;
  users:  Array<User> = [];
  userSelected: boolean = false;
  reciever;
  messages: Array<String>

  constructor( private chat: ChatService) { }

  ngOnInit(): void {
    this.users = this.chat.displayUsers();
  }

  send(){
    this.chat.sendMessage(this.message);
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
    this.userSelected = true;
    this.users = [];
    console.log(user.uid);
    this.reciever = user;
    this.chat.checkForUser(user);
    this.messages = this.chat.getMessages();
  }
}
