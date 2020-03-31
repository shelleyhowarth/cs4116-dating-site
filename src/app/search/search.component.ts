import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../services/users.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  genders = ["male", "female", "both"];
  ranges = ["55-60", "61-65", "66-70", "71-75", "76-80", "81-85", "85+"];
  interests = ["gardening", "painting", "reading", "walking", "cooking", "baking", "chess"];
  counties = [
    "Antrim",
    "Armagh",
    "Carlow",
    "Cavan",
    "Clare",
    "Cork",
    "Derry",
    "Donegal",
    "Down",
    "Dublin",
    "Fermanagh",
    "Galway",
    "Kerry",
    "Kildare",
    "Kilkenny",
    "Laois",
    "Leitrim",
    "Limerick",
    "Longford",
    "Louth",
    "Mayo",
    "Meath",
    "Monaghan",
    "Offaly",
    "Roscommon",
    "Sligo",
    "Tipperary",
    "Tyrone",
    "Waterford",
    "Westmeath",
    "Wexford",
    "Wicklow"
  ];
  form: FormGroup;
  filter = { gender: '', ageRange: [], location: [], interests: [] };
  users: Array<User> = [];
  constructor(private fb: FormBuilder, private usersService: UsersService, private firestore: AngularFirestore) { }

  ngOnInit(): void {
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
          object.county =  doc.data().county;
          object.drinker = doc.data().drinker;
          object.maritalStatus = doc.data().maritalStatus;
          object.occupation = doc.data().occupation;
          object.smoker = doc.data().smoker;
          object.interests = doc.data().interests;
          object.uid = doc.data().uid;
          this.users.push(object);
        });
        console.log(this.users);
       });

  }

  getName(user) {
    return user.firstName;
  }

  getAgeAndLocation(user) {
    return " " + user.age + ", " + user.county + " ";
  }

  search() { }

}
