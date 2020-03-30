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
          object.firstName = doc.data().FirstName;
          object.lastName = doc.data().LastName;
          object.age = doc.data().Age;
          object.description = doc.data().Description;
          object.gender = doc.data().Gender;
          object.email = doc.data().Email;
          object.favoriteSong = doc.data().FavoriteSong;
          object.favoriteMovie = doc.data().FavoriteMovie;
          object.county =  doc.data().county;
          object.drinker = doc.data().drinker;
          object.martialStatus = doc.data().martialStatus;
          object.occupation = doc.data().occupation;
          object.smoker = doc.data().smoker;
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

  search() {
   
  }

}
