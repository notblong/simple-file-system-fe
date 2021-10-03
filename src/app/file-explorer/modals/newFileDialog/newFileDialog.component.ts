import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-newFileDialog',
  templateUrl: './newFileDialog.component.html',
  styleUrls: ['./newFileDialog.component.scss']
})
export class NewFileDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<NewFileDialogComponent>) {}

  public fileName: string;
  public invalid = false;

  ngOnInit() {}

  public onChange() {
    this.invalid = !(/^[a-zA-Z0-9 _-]+$/).test(this.fileName);
  }
}
