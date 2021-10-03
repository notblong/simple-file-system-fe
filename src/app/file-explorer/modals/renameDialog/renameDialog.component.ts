import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-renameDialog',
  templateUrl: './renameDialog.component.html',
  styleUrls: ['./renameDialog.component.scss']
})
export class RenameDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<RenameDialogComponent>) {}

  public folderName: string;
  public invalid = false;


  ngOnInit() {}

  public onChange() {
    this.invalid = !(/^[a-zA-Z0-9 _-]+$/).test(this.folderName);
  }
}
