import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import * as firebase from "firebase";
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn;
  _db: AngularFirestore;
  admin = false;
  disabled = false;
  users;
  
  constructor(public afAuth: AngularFireAuth,
              public router: Router,
              private fs: AngularFirestore,
              private userService: UsersService
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
    var isUser = false
    var isDisabled = false;
    const snapshot = this.fs.collection('Users').get();
    snapshot.subscribe(snap => {
      snap.forEach(doc => {
          if (doc.data().disabled === true) {
            isDisabled = true;
            if (isDisabled) {
              window.alert("Account is disabled");
            }
          }
          else if (doc.data().email === email) {
            console.log(isUser);
            isUser = true;
            if (isUser) {
              console.log("here");
              return this.afAuth.auth.signInWithEmailAndPassword(email, password)
                .then((result) => {
                  this.router.navigate(['home']);
                }).catch((error) => {
                  window.alert(error.message)
                })
            }
            else {
              window.alert("No Account");
            }
          }
      });
    });
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
          foccupation: string, fmaritalStatus: string, fSmoker: string,
          fDrinker: string, fFavSong: string, fFavMovie: string, fInterests: Array<string>, fUid: string, fProfilePic: string) {
      let userCollection = this._db.collection<User>('Users');

      userCollection.doc(fUid).set({ firstName: fName, lastName: lName, age: fAge, email: fEmail,
      gender: fGender, description: fDescription, county: fcounty,
      occupation: foccupation, maritalStatus: fmaritalStatus, smoker: fSmoker,
      drinker: fDrinker, favoriteSong: fFavSong, favoriteMovie: fFavMovie, interests: fInterests, uid: fUid,
      profilePic: fProfilePic, admin: this.admin, disabled: this.disabled});
      
  }

}
