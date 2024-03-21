import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {API_KEY} from "../../env";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  http = inject(HttpClient);
  apiKey = API_KEY
  taskUrl: string = "https://tasks.aidevs.pl/task/"
  taskName: string = "helloapi"

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({"Content-Type": "application/json", 'Access-Control-Allow-Origin': '*',}),
  };

  constructor() {
  }

  getToken(): Observable<{ code: number, msg: string, token: string }> {
    return this.http.post<{
      code: number,
      msg: string,
      token: string
    }>("/token/" + this.taskName, {"apikey": this.apiKey}, this.httpOptions)
  }

  getTask(token: string): Observable<{ code: number, msg: string, cookie: string }> {
    return this.http.get<{ code: number, msg: string, cookie: string }>(this.taskUrl + token)
  }

  sendAnswer(token: string, answer: string): Observable<{ code: number, msg: string, note: string }> {
    return this.http.post<{
      code: number,
      msg: string,
      note: string
    }>(" answer/" + token, {"answer": answer}, this.httpOptions)
  }
}
