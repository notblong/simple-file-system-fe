import { Component } from '@angular/core';
import { CreateFileRequest } from './file-explorer/model/create-file-request';
import { FileElement } from './file-explorer/model/element';
import { FileRestService } from './shared/services/files/file-rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public fileElements: FileElement[];
  public stack: FileElement[] = [];

  public readonly ROOT = '/';
  public currentRoot: FileElement;
  public currentPath: string = this.ROOT;
  public canNavigateUp = false;

  constructor(
    private readonly fileExplorerService: FileRestService,
  ) {}

  public ngOnInit() {
    this.updateFileElementQuery();
  }

  public addFolder(folder: { name: string }) {
    const newFolder = { name: folder.name, isFolder: true, path: this.currentPath ? this.currentPath : this.ROOT };
    this.fileExplorerService.makeDirect(newFolder.name, newFolder.path).then(() => {
      this.updateFileElementQuery();
    });
  }

  public addFile(file: { name: string, data: string }) {
    const createFileRequest = new CreateFileRequest();
    createFileRequest.name = file.name;
    createFileRequest.size = 10;
    createFileRequest.path = this.currentPath ? this.currentPath : this.ROOT;
    createFileRequest.fileExtension = 'txt';
    createFileRequest.data = file.data;
    this.fileExplorerService.createFile(createFileRequest).then(() => {
      this.updateFileElementQuery();
    });
  }

  public navigateToFolder(element: FileElement) {
    const currentRoot = element;
    this.stack.push(currentRoot);
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.query(this.currentPath);
    this.canNavigateUp = true;
  }

  public navigateUp() {
    if (this.stack.length == 1) {
      this.canNavigateUp = false;
      this.stack.pop();
      this.currentPath = this.popFromPath(this.currentPath);
      this.updateFileElementQuery();
    } else {
      this.stack.pop();
      this.currentPath = this.popFromPath(this.currentPath);
      this.updateFileElementQuery();
    }
  }

  public moveElement(event: { element: FileElement; moveTo: FileElement }) {}

  public renameElement(element: FileElement) {}

  public removeElement(element: FileElement) {}

  public updateFileElementQuery() {
    this.query(this.currentPath ? this.currentPath : this.ROOT);
  }

  public pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  public popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

  public query(path: string) {
    this.fileExplorerService.list(path).then(resp => {
      if (resp && resp.errorCode == 0) {
        const children = resp.data;
        this.fileElements = [];
        children.forEach(file => {
          this.fileElements.push(
            {
              id: file.id,
              name: file.name,
              path: file.path,
              isFolder: file.folder,
              fileExtension: file.fileExtension,
              data: file.data,
            });
        });
      }
    })
    .catch(err => {
      console.log('error', err);
    });
  }
}
