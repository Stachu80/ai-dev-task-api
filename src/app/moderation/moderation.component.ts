import {Component, inject} from '@angular/core';
import {first, Observable, Subject, switchMap, tap} from "rxjs";
import {ApiService} from "../api.service";
import {AsyncPipe, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {ModerationService} from "./moderation.service";
import {Answer} from "../models/answer.type";

interface ModerationTaskType {
  input: string[],
  msg: string
}

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    UpperCasePipe
  ],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.scss'
})
export class ModerationComponent {
  taskName: string = "moderation";
  getTaskTxt: string = "Pobierz zadanie";
  showAnswerTxt: string = "Pokaż odpowiedż";
  api: ApiService = inject(ApiService);
  moderationService: ModerationService = inject(ModerationService);
  getTask$: Subject<void> = new Subject();
  answer$: Observable<number[]> = this.moderationService.getAnswer();
  getAnswer$: Subject<void> = new Subject<void>;

  showAnswer$: Observable<Answer> = this.getAnswer$.pipe(
    switchMap(() => this.moderationService.sendAnswer()
    )
  )

  task$: Observable<ModerationTaskType> = this.getTask$.pipe(
    first(),
    switchMap(() => this.moderationService.getTask(this.taskName)
    )
  );

  getTask = (): void => {
    this.getTask$.next()
  }

  sendAnswer = (): void => {
    this.getAnswer$.next()
  }
}
