import {Component, inject} from '@angular/core';
import {HelloApiService} from "../helloapi/hello-api.service";
import {Observable, share, Subject, switchMap, tap} from "rxjs";
import {Answer} from "../models/answer.type";
import {AsyncPipe, NgIf, UpperCasePipe} from "@angular/common";
import {TaskType} from "../models/task.type";
import {WhisperService} from "./whisper.service";
import {API_OPEN_AI_KEY} from "../../../env";
import {OpenAI} from "openai";

@Component({
  selector: 'app-whisper',
  standalone: true,
  imports: [
    UpperCasePipe,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './whisper.component.html',
  styleUrl: './whisper.component.scss'
})
export class WhisperComponent {
  taskName: string = "whisper";
  whisperService: WhisperService = inject(WhisperService);
  getTask$: Subject<void> = new Subject();
  getAnswer$: Subject<string> = new Subject<string>;

  task$: Observable<TaskType> = this.getTask$.pipe(
    share(),
    switchMap(() => this.whisperService.getTask(this.taskName) as Observable<TaskType>),
    tap((data) => {
      console.log(data);
    })
  )


  showAnswer$: Observable<Answer> = this.getAnswer$.pipe(
    switchMap((cookie) => this.whisperService.sendAnswer(cookie))
  );

  getTask = (): void => {
    this.getTask$.next();
  }

  async getSpeechToText() {
    const config = {apiKey: API_OPEN_AI_KEY, dangerouslyAllowBrowser: true}
    const openai: OpenAI = new OpenAI(config);

    // using regex extract link from the msg
    const url: string = 'please return transcription of this file: https://tasks.aidevs.pl/data/mateusz.mp3'
    // @ts-ignore
    const link = url.match(/https:\/\/\S+/)[0];
    console.log(link);

    //const blob = await fetch(link).then(r => r.blob());
    //  const file = new File([blob], "audio.mp3");
    // console.log(file)


    const transcription = await openai.audio.transcriptions.create({
      // @ts-ignore
      "file": link,
      "model": "whisper-1"
    })

    console.log(transcription.text)

  }

  sendAnswer = (cookie: string | undefined): void => {
    cookie && this.getAnswer$.next(cookie)
  }
}
