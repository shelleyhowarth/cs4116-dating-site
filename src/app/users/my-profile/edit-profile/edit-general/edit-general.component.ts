import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-edit-general',
  templateUrl: './edit-general.component.html',
  styleUrls: ['./edit-general.component.scss']
})
export class EditGeneralComponent implements OnInit {
  @Input() entry;

  generalObject = {
    favoriteSong: ""
  }
  constructor() { }

  ngOnInit(): void {
  }

}
