import {Component, inject} from '@angular/core';
import {ApiService} from "../api.service";
import {combineLatest, first, map, Observable, Subject, switchMap} from "rxjs";
import {AsyncPipe, NgIf, UpperCasePipe} from "@angular/common";
import {LiarTaskType} from "./models/liar-task.type";
import {LiarService} from "./liar.service";
import {LiarAnswer} from "./models/liar-answer.type";
import {Answer} from "../models/answer.type";

@Component({
  selector: 'app-liar',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    UpperCasePipe
  ],
  templateUrl: './liar.component.html',
  styleUrl: './liar.component.scss'
})
export class LiarComponent {
  liarApi: LiarService = inject(LiarService);
  taskName: string = "liar";
  getTaskTxt: string = "Pobierz zadanie";
  questionText: string = 'What is capitol of Belgium';
  getTask$: Subject<void> = new Subject();
  getAnswer$: Subject<"YES" | "NO"> = new Subject<"YES" | "NO">;
  getCorrectAnswer$: Subject<string> = new Subject<string>
  getSystemAnswer$: Subject<string> = new Subject<string>

  task$: Observable<LiarTaskType> = this.getTask$.pipe(
    switchMap(() => {
      return this.liarApi.getTask(this.taskName) as Observable<LiarTaskType>
    }));

  showCorrectAnswer$: Observable<string> = this.getCorrectAnswer$.pipe(
    switchMap((question: string) => {
      return this.liarApi.getCorrectAnswer(question)
    })
  );

  showSystemAnswer$: Observable<LiarAnswer> = this.getSystemAnswer$.pipe(
    switchMap((question: string) => {
      return this.liarApi.getSystemAnswer(question)
    })
  );

  isCheckAnswerVisible$: Observable<"YES" | "NO"> =
    combineLatest([this.showCorrectAnswer$, this.showSystemAnswer$]).pipe(
      map(([correctAnswer, systemAnswer]) => correctAnswer === systemAnswer.answer ? "YES" : "NO")
    );

  showAnswer$: Observable<Answer> = this.getAnswer$.pipe(
    switchMap((answer: "YES" | "NO") => {
        return this.liarApi.sendAnswer(answer)
      }
    )
  );

  getAnswer = (answer: "YES" | "NO"): void => {
    this.getAnswer$.next(answer)
  }
  getTask = (): void => {
    this.getTask$.next();
  }

  getCorrectAnswer = (): void => {
    this.getCorrectAnswer$.next(this.questionText)
  }

  getSystemAnswer = (): void => {
    this.getSystemAnswer$.next(this.questionText)
  }
}

