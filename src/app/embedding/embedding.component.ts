import {Component, inject} from '@angular/core';
import {AsyncPipe, NgIf, UpperCasePipe} from "@angular/common";
import {HelloApiService} from "../helloapi/hello-api.service";
import {Observable, share, Subject, switchMap} from "rxjs";
import {Answer} from "../models/answer.type";
import {EmbeddingService} from "./embedding.service";
import {TaskType} from "../models/task.type";

@Component({
  selector: 'app-embedding',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    UpperCasePipe
  ],
  templateUrl: './embedding.component.html',
  styleUrl: './embedding.component.scss'
})
export class EmbeddingComponent {
  taskName: string = "embedding";
  embeddingService:EmbeddingService = inject(EmbeddingService);
  getTask$: Subject<void> = new Subject();
  getEmbedding$: Subject<void> = new Subject();

  embedding$:Observable<any> = this.embeddingService.generateEmbedding("Hawaii pizza")

  task$: Observable<TaskType> = this.getTask$.pipe(
    share(),
    switchMap(() => this.embeddingService.getTask(this.taskName) as Observable<TaskType>));
  getAnswer$: Subject<string> = new Subject<string>;

  showAnswer$: Observable<Answer> = this.getAnswer$.pipe(
    switchMap((cookie) => this.embeddingService.sendAnswer(cookie))
  );

  getTask = (): void => {
    this.getTask$.next();

  }
  getEmbedding = ()  =>  this.embeddingService.generateEmbedding("Hawaii pizza").subscribe((obj:any) => {
    console.log(obj.data[0].embedding)
    this.embeddingService.sendAnswer(obj.data[0].embedding).subscribe()
  })
}
