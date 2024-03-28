import {inject, Injectable} from '@angular/core';
import {forkJoin, Observable, switchMap, take, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiService} from "../api.service";
import {Answer} from "../models/answer.type";

@Injectable({
  providedIn: 'root'
})
export class HelloApiService {
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
  sendAnswer = (cookie:string): Observable<Answer> => {
    return this.api.sendAnswer(this.temporaryTaskToken, cookie)
  }
}
