import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  searchPress = false;    
  filter = { gender: '', ageRange: [], location: [], interests: [] };
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  search() {
    this.searchPress = true;
    console.log(this.filter);
  }

}
