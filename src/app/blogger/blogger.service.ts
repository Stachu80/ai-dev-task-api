import {inject, Injectable} from '@angular/core';
import {API_OPEN_AI_KEY} from "../../../env";
import {OpenAI} from "openai";
import {first, forkJoin, from, Observable, switchMap} from "rxjs";
import {Token} from "../models/token.type";
import {ApiService} from "../api.service";
import {BloggerType} from "./models/blogger.type";
import {Answer} from "../models/answer.type";

@Injectable({
  providedIn: 'root'
})
export class BloggerService {
  private api: ApiService = inject(ApiService);
  private temp: string = ''

  getTask(taskName: string): Observable<BloggerType> {
    return this.api.getToken(taskName).pipe(
      first(),
      switchMap((data: Token) => {
        this.temp = data.token;
        return this.api.getTask(data.token) as Observable<BloggerType>
      })
    )
  }

  writeBlog(task: BloggerType): Observable<string[]> {
    return forkJoin(task.blog.map(post => from(this.writePost(post))))
  }

  sendAnswer(blog: string[]): Observable<Answer> {
    return this.api.sendAnswer(this.temp, blog)
  }

  private async writePost(sentence: string): Promise<string> {
    const config = {apiKey: API_OPEN_AI_KEY, dangerouslyAllowBrowser: true}
    const openai:OpenAI = new OpenAI(config);
    const completion:OpenAI.ChatCompletion = await openai.chat.completions.create({
      messages: [{role: "system", content: "please write blog post for the provided outline" + sentence}],
      model: "gpt-3.5-turbo",
    });

    return completion.choices[0].message.content as string;
  }
}
