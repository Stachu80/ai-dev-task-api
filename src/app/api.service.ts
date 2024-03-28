import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_DEV_KEY} from "../../env";
import {Token} from "./models/token.type";
import {Answer} from "./models/answer.type";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http: HttpClient = inject(HttpClient);
  apiKey: string = API_DEV_KEY
  taskUrl: string = "https://tasks.aidevs.pl/task/"
  headersConfig = {"Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'}
  httpOptions: { headers: HttpHeaders } = {headers: new HttpHeaders(this.headersConfig)};

  getToken = (taskName: string): Observable<Token> =>
    this.http.post<Token>("/token/" + taskName, {"apikey": this.apiKey}, this.httpOptions)


  getTask = (token: string): Observable<unknown> => this.http.get(this.taskUrl + token)


  sendAnswer = (token: string, answer: unknown): Observable<Answer> => {
    return this.http.post<Answer>("answer/" + token, {"answer": answer}, this.httpOptions)
  }
}
