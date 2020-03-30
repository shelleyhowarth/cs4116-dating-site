import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn;
  _db: AngularFirestore;
  
  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              private fs: AngularFirestore,
              ) { 
                this._db = fs;
    }

  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert("You have been successfully registered!");
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.router.navigate(['home']);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  /* Sign out */
  SignOut() {
    this.afAuth.auth.signOut();
  }

  isAuthenticated() {
    if(firebase.auth().currentUser != null) {
      this.loggedIn = true;
    }
    else {
      this.loggedIn = false;
    }
    return this.loggedIn;
  }

  addUser(fName: string, lName: string, fAge: number, fEmail: string,
          fGender: string, fDescription: string, fcounty: string,
          foccupation: string, fMartialStatus: string, fSmoker: boolean,
          fDrinker: boolean, fFavSong: string, fFavMovie: string) {
      let userCollection = this._db.collection<User>('Users');
      userCollection.doc(fEmail).set({ firstName: fName, lastName: lName, age: fAge, email: fEmail,
      gender: fGender, description: fDescription, county: fcounty,
      occupation: foccupation, martialStatus: fMartialStatus, smoker: fSmoker,
      drinker: fDrinker, favoriteSong: fFavSong, favoriteMovie: fFavMovie});
  }

}
