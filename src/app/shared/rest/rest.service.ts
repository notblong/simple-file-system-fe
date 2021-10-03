import { HttpClient } from "@angular/common/http";

export abstract class RestService {
  public host = 'https://simple-file-system.herokuapp.com';
  constructor(private http: HttpClient, public resourceUrl?: string) { }

  public get(path: string): Promise<any> {
    return this.http.get(`${this.host}/${this.resourceUrl}${path}`).toPromise();
  }

  public post(path: string): Promise<any> {
    return this.http.post(`${this.host}/${this.resourceUrl}${path}`, null).toPromise();
  }
}
