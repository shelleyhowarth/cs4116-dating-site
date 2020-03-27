import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  users;
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
/*     this.firestore.collection('Users').snapshotChanges().subscribe(res => {
      this.users = res;
      console.log(this.users);
    }); */
    this.users = this.firestore.collection('interests').valueChanges().subscribe(res => {
      this.users = res;
      console.log(this.users);
    });
  }

}
