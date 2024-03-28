import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable, switchMap} from "rxjs";
import {ApiService} from "../api.service";
import {OpenAI} from "openai";
import {API_OPEN_AI_KEY} from "../../../env";
import {LiarAnswer} from "./models/liar-answer.type";
import {Answer} from "../models/answer.type";


@Injectable({
  providedIn: 'root'
})
export class LiarService {
  private http: HttpClient = inject(HttpClient);
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

  getCorrectAnswer = (questionText: string): Observable<string> => {
    return from(this.getOpenAiAnswer(questionText))
  }

  getSystemAnswer = (questionText: string): Observable<LiarAnswer> => {
    return this.getAiDevsAnswer(this.temporaryTaskToken, questionText)
  }


  sendAnswer = (answer: string): Observable<Answer> => {
    return this.api.sendAnswer(this.temporaryTaskToken, answer)
  }

  private async getOpenAiAnswer(sentence: string): Promise<string> {
    const openai = new OpenAI({
      apiKey: API_OPEN_AI_KEY, dangerouslyAllowBrowser: true
    });
    const completion: OpenAI.ChatCompletion = await openai.chat.completions.create({
      messages: [{role: "system", content: "please answer the question:" + sentence}],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content as string;
  }

  private getAiDevsAnswer(token: string, question: string): Observable<LiarAnswer> {
    const url: string = "https://tasks.aidevs.pl/task/";
    const form = new FormData();
    form.append('question', question);
    return this.http.post(url + token, form) as Observable<LiarAnswer>
  }
}
