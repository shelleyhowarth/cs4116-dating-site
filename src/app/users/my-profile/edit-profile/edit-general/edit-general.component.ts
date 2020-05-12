import { Component, OnInit, Input } from '@angular/core';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';


@Component({
  selector: 'app-edit-general',
  templateUrl: './edit-general.component.html',
  styleUrls: ['./edit-general.component.scss']
})
export class EditGeneralComponent implements OnInit {
  @Input() entry;
  @Input() current;
  user: User;
  currentOccupation;
  currentSmoker;
  currentDrinker;
  currentFavMov;
  currentFavSong;
  generalObject;
  uid;
  valid;
  edited;

  constructor(private modal: NzModalRef, public router: Router, private modalService: NzModalService, private fs: AngularFirestore) { }

  ngOnInit(): void {
    this.user = this.modal.getInstance().nzComponentParams.entry;
    this.uid = this.modal.getInstance().nzComponentParams.uid;
    this.generalObject = this.modal.getInstance().nzComponentParams.current;
    this.setCurrents();
  }

  setCurrents(){
    this.currentDrinker = this.generalObject.drinker;
    this.currentSmoker = this.generalObject.smoker;
    this.currentOccupation = this.generalObject.occupation;
    this.currentFavMov = this.generalObject.favMov;
    this.currentFavSong = this.generalObject.favSong;
  }

  onEdit(variable) {
    if(variable.length === 0) {
      this.edited = false;
    }
    else
      this.edited = true;
  }

  update(){
    let userCollection = this.fs.collection<User>('Users');
    userCollection.doc(this.uid).update({
      occupation: this.currentOccupation,
      drinker: this.currentDrinker,
      smoker: this.currentSmoker,
      favoriteMovie: this.currentFavMov,
      favoriteSong: this.currentFavSong
    });
    this.modalService.closeAll();
  }
}
