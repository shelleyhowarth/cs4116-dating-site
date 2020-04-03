import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: AngularFirestore) { }

  getUsers() {
    const snapshot = this.firestore.collection('Users').get();
    let array;
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
          array.push(object);
        });
       });
       return array;
  }
}
