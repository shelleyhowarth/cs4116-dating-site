import { Component, OnInit, Input, NgZone } from '@angular/core';
import { NzModalRef, NzModalService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'src/app/model/user.model';


@Component({
  selector: 'app-edit-interest',
  templateUrl: './edit-interest.component.html',
  styleUrls: ['./edit-interest.component.scss']
})
export class EditInterestComponent implements OnInit {
  @Input() entry;
  @Input() current;
  interests = ["Gardening", "Painting", "Reading", "Walking", "Cooking", "Baking", "Puzzles", "Music", "Exercising"]
  currentInterests;
  user;
  defaultOption;
  uid;

  constructor(private modal: NzModalRef, private authService: AuthService, public router: Router, private modalService: NzModalService, private zone: NgZone, private db: AngularFirestore) { }



  ngOnInit(): void {
    this.user = this.modal.getInstance().nzComponentParams.entry;
    this.uid = this.modal.getInstance().nzComponentParams.uid;
    let currInterests = this.modal.getInstance().nzComponentParams.current;
    this.currentInterests =  currInterests;
    this.defaultOption = [...this.currentInterests];
  }

  update(){
    this.updateInterests(this.currentInterests, this.uid);
    this.modalService.closeAll();
  }

  updateInterests(updatedInterests: [], userId: string) {
    let userCollection = this.db.collection<User>('Users');
    userCollection.doc(userId).update({ interests: updatedInterests })
  }

}
