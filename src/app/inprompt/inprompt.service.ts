import {inject, Injectable} from '@angular/core';
import {ApiService} from "../api.service";
import {Observable, switchMap} from "rxjs";
import {Answer} from "../models/answer.type";

@Injectable({
  providedIn: 'root'
})
export class InpromptService {
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
  sendAnswer = (answer:string): Observable<Answer> => {
    return this.api.sendAnswer(this.temporaryTaskToken, answer)
  }
}
