import { Component, OnInit, Input, NgZone } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';


@Component({
  selector: 'app-edit-interest',
  templateUrl: './edit-interest.component.html',
  styleUrls: ['./edit-interest.component.scss']
})
export class EditInterestComponent implements OnInit {
  @Input() entry;
  @Input() current;
  interests = ["gardening", "painting", "reading", "walking", "cooking", "baking", "chess"];
  currentInterests;
  user;
  defaultOption;

  constructor(private modal: NzModalRef, private authService: AuthService, public router: Router, private modalService: NzModalService, private zone: NgZone) { }



  ngOnInit(): void {
    this.user = this.modal.getInstance().nzComponentParams.entry;
    let currInterests = this.modal.getInstance().nzComponentParams.current;
    this.currentInterests =  currInterests;
    this.defaultOption = [...this.currentInterests];

    console.log("User "+ this.user);
    console.log("Interests "+ this.currentInterests);
    console.log("default "+ this.defaultOption);
  }

  update(){
    let uid = firebase.auth().currentUser.uid
    this.authService.updateInterests(this.currentInterests, uid);
    this.modalService.closeAll();
  }

}
