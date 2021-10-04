import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateFileRequest } from "src/app/file-explorer/model/create-file-request";
import { RestService } from "../../rest/rest.service";


@Injectable({providedIn: 'root'})
export class FileRestService extends RestService {
  constructor(http: HttpClient) {
    super(http, 'files');
  }

  public list(filePath: string) {
    return super.get(`/ls?path=${filePath}`);
  }

  public makeDirect(name: string, filePath: string) {
    return super.post(`/mkdir?path=${filePath}&name=${name}`, null);
  }

  public changeDirect(filePath: string) {
    return super.get(`/cd?path=${filePath}`);
  }

  public createFile(request: CreateFileRequest) {
    return super.post(`/cr`, request);
  }
}
