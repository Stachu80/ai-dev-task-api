import {Component, inject} from '@angular/core';
import {AsyncPipe, NgIf, UpperCasePipe} from "@angular/common";
import {Observable, share, shareReplay, Subject, switchMap} from "rxjs";
import {HelloApiService} from "./hello-api.service";
import {Answer} from "../models/answer.type";

@Component({
  selector: 'app-hello-api',
  standalone: true,
  imports: [
    UpperCasePipe,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './hello-api.component.html',
  styleUrl: './hello-api.component.scss'
})
export class HelloApiComponent {
  taskName: string = "helloapi";
  helloApiService: HelloApiService = inject(HelloApiService);
  getTask$: Subject<void> = new Subject();
  task$: Observable<Answer> = this.getTask$.pipe(
    share(),
    switchMap(() => this.helloApiService.getTask(this.taskName) as Observable<Answer>));
  getAnswer$: Subject<string> = new Subject<string>;

  showAnswer$: Observable<Answer> = this.getAnswer$.pipe(
    switchMap((cookie) => this.helloApiService.sendAnswer(cookie))
  );

  getTask = (): void => {
    console.log("bum")
    this.getTask$.next();
  }

  sendAnswer = (cookie: string | undefined): void => {
    cookie && this.getAnswer$.next(cookie)
  }
}
