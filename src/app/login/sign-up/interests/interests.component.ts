import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from "firebase";
import { Router } from '@angular/router';

@Component({
  selector: 'app-interests',
  templateUrl: './interests.component.html',
  styleUrls: ['./interests.component.scss']
})
export class InterestsComponent implements OnInit {
  @Input() entry;
  user;
  isSmoker;
  isDrinker;
  actualAge;
  interests = ["gardening", "painting", "reading", "walking", "cooking", "baking", "chess"];
  chosenInterests = [];
  constructor(private modal: NzModalRef, private authService: AuthService, public router: Router, private modalService: NzModalService, ) { }

  ngOnInit(): void {
    this.user = this.modal.getInstance().nzComponentParams.entry;
  }

  submit() {
    if(this.user.smoker == "smoker") {
      this.isSmoker = true;
    }
    else {
      this.isSmoker = false;
    }

    if(this.user.drinker == "drinker")
      this.isDrinker = true;
    else
    this.isDrinker = false;

    var timeDiff = Math.abs(Date.now() - new Date(this.user.age).getTime());
    this.actualAge = Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25); 
    this.authService.addUser(this.user.firstName, this.user.lastName, this.actualAge, this.user.email, this.user.gender, this.user.description,
                              this.user.county, this.user.occupation, this.user.martialStatus, this.user.smoker, this.user.drinker,
                              this.user.favoriteSong, this.user.favoriteMovie);
    this.router.navigate(['home']);
    this.modalService.closeAll();
  }

}
