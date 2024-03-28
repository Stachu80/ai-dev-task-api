import {Component, inject} from '@angular/core';
import {Observable, share, Subject, switchMap} from "rxjs";
import {Answer} from "../models/answer.type";
import {AsyncPipe, NgIf, UpperCasePipe} from "@angular/common";
import {InpromptService} from "./inprompt.service";
import {InpromptTaskType} from "./models/inprompt-task.type";
import {HumanMessage, SystemMessage} from "langchain/schema";
import {ChatOpenAI} from "langchain/chat_models/openai";
import {OpenAI} from "openai";
import {API_OPEN_AI_KEY} from "../../../env";
import {Messages} from "openai/resources/beta/threads";
import MessageContent = Messages.MessageContent;


@Component({
  selector: 'app-inprompt',
  standalone: true,
  imports: [
    UpperCasePipe,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './inprompt.component.html',
  styleUrl: './inprompt.component.scss'
})
export class InpromptComponent {
  taskName: string = "inprompt";
  inpromptService: InpromptService = inject(InpromptService);
  getTask$: Subject<void> = new Subject();
  task$: Observable<InpromptTaskType> = this.getTask$.pipe(
    share(),
    switchMap(() => this.inpromptService.getTask(this.taskName) as Observable<InpromptTaskType>));
  getAnswer$: Subject<string> = new Subject<string>;
  sendAnswer$: Subject<string> = new Subject<string>;
  answer$: Observable<Answer> = this.getAnswer$.pipe(switchMap((answer) => this.inpromptService.sendAnswer(answer)));

  showAnswer$: Observable<Answer> = this.getAnswer$.pipe(
    switchMap((cookie) => this.inpromptService.sendAnswer(cookie))
  );

  getTask = (): void => {
    this.getTask$.next();
  }

  sendAnswer = (answer: string): void => {
    this.getAnswer$.next(answer)
  }

  async getAnswer(input: string[], question: string) {
    const openai = new OpenAI({
      apiKey: API_OPEN_AI_KEY, dangerouslyAllowBrowser: true
    });
    const chat = new ChatOpenAI({openAIApiKey: API_OPEN_AI_KEY});
    const {content} = await chat.invoke([
      new SystemMessage(`
        Answer questions as truthfully using the context below and nothing more.
         If you don't know the answer, say "don't know".
         Answer in Polish
        context###${input}###
    `),
      new HumanMessage(
        question
      ),
    ]);

    console.log(content);
    this.sendAnswer$.next(content as string);
  }
}
