import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FileExplorerComponent } from './file-explorer.component';
import { FileDialogComponent } from './modals/fileDialog/fileDialog.component';
import { NewFileDialogComponent } from './modals/newFileDialog/newFileDialog.component';
import { NewFolderDialogComponent } from './modals/newFolderDialog/newFolderDialog.component';
import { RenameDialogComponent } from './modals/renameDialog/renameDialog.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    FileExplorerComponent,
    NewFolderDialogComponent,
    RenameDialogComponent,
    FileDialogComponent,
    NewFileDialogComponent
  ],
  exports: [FileExplorerComponent],
  entryComponents: [
    NewFolderDialogComponent,
    RenameDialogComponent,
    NewFolderDialogComponent,
    NewFileDialogComponent
  ]
})
export class FileExplorerModule {}
