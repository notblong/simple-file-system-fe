import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class FileService {
  constructor() {}

  public popFromPath(path: string) {
    if (this.isRoot(path)) {
      return path;
    }

    let p = path ? path : '';
    let split = p.split('/');
    split.splice(split.length - 2, 1);
    p = split.join('/');
    return p;
  }

  public pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}/`;
    return p;
  }

  public isRoot(currentPath) {
    return currentPath == '/';
  }
}
