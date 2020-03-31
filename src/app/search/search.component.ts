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

  genders = ["male", "female"];
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
  searchArray: Array<User> = [];
  constructor(private fb: FormBuilder, private firestore: AngularFirestore, private usersService: UsersService) { }

  ngOnInit(): void {

  }

  getName(user) {
    return user.firstName;
  }

  getAgeAndLocation(user) {
    return " " + user.age + ", " + user.county + " ";
  }

  search() {
    this.usersService.getUsers(this.users);
    console.log(this.filter);
    this.users = this.users.filter(user => {
      user.gender === this.filter.gender;
      })
    console.log(this.users);
   }

}
