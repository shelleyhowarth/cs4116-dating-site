import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  users: Array<User> = [];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    const snapshot = this.firestore.collection('Users').get();
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
        object.county = doc.data().county;
        object.drinker = doc.data().drinker;
        object.maritalStatus = doc.data().maritalStatus;
        object.occupation = doc.data().occupation;
        object.smoker = doc.data().smoker;
        object.interests = doc.data().interests;
        object.uid = doc.data().uid;
        object.profilePic = doc.data().profilePic;
        this.users.push(object);
      });
    });
  }
}
