import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
    return super.post(`/mkdir?path=${filePath}&name=${name}`);
  }

  public changeDirect(filePath: string) {
    return super.get(`/cd?path=${filePath}`);
  }
}
