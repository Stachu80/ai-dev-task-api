import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {API_OPEN_AI_KEY} from "../../../env";
import {first, forkJoin, map, Observable, Subject, switchMap, tap} from "rxjs";
import {IModertion} from "./models/moderation.type";
import {ApiService} from "../api.service";
import {Answer} from "../models/answer.type";
import {Token} from "../models/token.type";
import {ModerationTaskType} from "./models/moderation-task-type";

@Injectable({
  providedIn: 'root'
})
export class ModerationService {
  private http: HttpClient = inject(HttpClient);
  private api: ApiService = inject(ApiService);
  private url: string = "https://api.openai.com/v1/moderations";
  private temporaryToken: string = '';
  private task: ModerationTaskType = {input: [], msg: ''};
  private answer: Subject<number[]> = new Subject<number[]>()
  private httpModerationOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + API_OPEN_AI_KEY
    }),
  };

  getTask = (taskName: string): Observable<ModerationTaskType> =>
    this.api.getToken(taskName).pipe(
      first(),
      switchMap((data: Token) => {
        this.temporaryToken = data.token;
        return this.api.getTask(data.token);
      }),
      map((data) => this.task = data as ModerationTaskType)
    )

  sendAnswer = (): Observable<Answer> =>
    forkJoin(
      this.task?.input.map((sentence: string) => this.checkSentence(sentence))
    ).pipe(
      tap((data: number[]) => this.answer.next(data)),
      switchMap((data: number[]) => this.api.sendAnswer(this.temporaryToken, data))
    )

  getAnswer = (): Observable<number[]> => this.answer

  private checkSentence = (sentence: string): Observable<number> =>
    this.sendQuestionToModeration(sentence).pipe(
      map((data: Object) => (+(data as IModertion).results[0].flagged)))


  private sendQuestionToModeration = (question: string): Observable<Object> =>
    this.http.post(this.url, {"input": question}, this.httpModerationOptions)

}
