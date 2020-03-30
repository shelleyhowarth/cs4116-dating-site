import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import * as firebase from "firebase";
import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn;
  uid : string;

  constructor(public afAuth: AngularFireAuth,
              public router: Router) { 
    }

  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.uid = result.user.uid;
        console.log(this.uid);
        window.alert("You have been successfully registered!");
        console.log(result.user)
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  getUid() {
    return this.uid;
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Successfully signed up!', result);
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
