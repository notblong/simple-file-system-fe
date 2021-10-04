import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { FileDialogComponent } from './modals/fileDialog/fileDialog.component';
import { NewFileDialogComponent } from './modals/newFileDialog/newFileDialog.component';
import { NewFolderDialogComponent } from './modals/newFolderDialog/newFolderDialog.component';
import { RenameDialogComponent } from './modals/renameDialog/renameDialog.component';
import { FileElement } from './model/element';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  @Input() fileElements: FileElement[];
  @Input() canNavigateUp: string;
  @Input() path: string;
  @Input() isLoading = false;

  @Output() folderAdded = new EventEmitter<{ name: string }>();
  @Output() fileAdded = new EventEmitter<{ name: string, data: string }>();
  @Output() elementRemoved = new EventEmitter<FileElement>();
  @Output() elementRenamed = new EventEmitter<FileElement>();
  @Output() elementMoved = new EventEmitter<{ element: FileElement; moveTo: FileElement }>();
  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  public ngOnInit(): void {}

  public deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  public navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    } else {
      this.openDetailFile(element);
    }
  }

  public navigateUp() {
    this.navigatedUp.emit();
  }

  public moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }

  public openNewFolderDialog() {
    let dialogRef = this.dialog.open(NewFolderDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.folderAdded.emit({ name: res });
      }
    });
  }

  public openNewFileDialog() {
    let dialogRef = this.dialog.open(NewFileDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.fileAdded.emit({ name: res[0], data: res[1] });
      }
    });
  }

  public openRenameDialog(element: FileElement) {
    let dialogRef = this.dialog.open(RenameDialogComponent);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        element.name = res;
        this.elementRenamed.emit(element);
      }
    });
  }

  public openMenu(event: MouseEvent, viewChild: MatMenuTrigger) {
    event.preventDefault();
    // viewChild.openMenu();
  }

  public openDetailFile(element: FileElement) {
    let dialogRef = this.dialog.open(FileDialogComponent, {
      data: {
        fileName: element.name,
        fileData: element.data,
        fileExtension: element.fileExtension
      }
    });
  }
}
