import {inject, Injectable} from '@angular/core';
import {ApiService} from "../api.service";
import {Observable, switchMap} from "rxjs";
import {Answer} from "../models/answer.type";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {API_OPEN_AI_KEY} from "../../../env";

@Injectable({
  providedIn: 'root'
})
export class EmbeddingService {
  private http: HttpClient = inject(HttpClient);

  private url: string = "https://api.openai.com/v1/embeddings";
  private temporaryToken: string = '';


  private httpEmbeddingOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + API_OPEN_AI_KEY
    }),
  };

  private api: ApiService = inject(ApiService);
  private temporaryTaskToken: string = ''

  getTask = (taskName: string): Observable<unknown> => {
    return this.api.getToken(taskName).pipe(
      switchMap((data) => {
        this.temporaryTaskToken = data.token;
        return this.api.getTask(data.token)
      }),
    )
  }
  sendAnswer = (answer: string): Observable<Answer> => {
    return this.api.sendAnswer(this.temporaryTaskToken, answer)
  }

  generateEmbedding = (question: string): Observable<Object> =>
    this.http.post(this.url, {"input": question, "model": "text-embedding-ada-002"}, this.httpEmbeddingOptions)
}
