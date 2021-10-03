import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-newFolderDialog',
  templateUrl: './newFolderDialog.component.html',
  styleUrls: ['./newFolderDialog.component.scss']
})
export class NewFolderDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<NewFolderDialogComponent>) {}

  public folderName: string;
  public invalid = false;

  ngOnInit() {}

  public onChange() {
    this.invalid = !(/^[a-zA-Z0-9 _-]+$/).test(this.folderName);
  }
}
