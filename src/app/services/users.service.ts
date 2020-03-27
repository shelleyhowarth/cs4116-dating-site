import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: AngularFirestore) { }

  getUsers() {
    let users;
    const snapshot = this.firestore.collection('Users').get();
    snapshot.subscribe(snap => {
       snap.forEach(doc => {
          users = doc.data();
        });
      });
      return users;
  }
}
