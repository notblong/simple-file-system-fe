import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fileDialog',
  templateUrl: './fileDialog.component.html',
  styleUrls: ['./fileDialog.component.scss']
})
export class FileDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileDialogComponent>,
  ) {}

  public fileData = '';
  public displayName = '';


  ngOnInit() {
    this.fileData = this.data.fileData;
    this.displayName = `${this.data.fileName}.${this.data.fileExtension}`;
  }
}
