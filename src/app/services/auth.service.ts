import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn;

  constructor(public afAuth: AngularFireAuth,
              public router: Router) { 
    }

  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert("You have been successfully registered!");
        this.router.navigate(['home']);
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

}
