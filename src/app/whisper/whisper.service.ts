import {inject, Injectable} from '@angular/core';
import {forkJoin, Observable, switchMap, take, tap} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiService} from "../api.service";
import {Answer} from "../models/answer.type";
import {API_OPEN_AI_KEY} from "../../../env";
import {OpenAI} from "openai";

@Injectable({
  providedIn: 'root'
})
export class WhisperService {
  private http: HttpClient = inject(HttpClient);
  private api: ApiService = inject(ApiService);
  private temporaryTaskToken: string = ''
  private url: string = "https://api.openai.com/v1/speech-to-text/translate";
  private temporaryToken: string = '';
  private httpEmbeddingOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + API_OPEN_AI_KEY
    }),
  };

  getTask = (taskName: string): Observable<unknown> => {
    return this.api.getToken(taskName).pipe(
      switchMap((data) => {
        this.temporaryTaskToken = data.token;
        return this.api.getTask(data.token)
      }),
    )
  }
  sendAnswer = (cookie: string): Observable<Answer> => {
    return this.api.sendAnswer(this.temporaryTaskToken, cookie)
  }
}
