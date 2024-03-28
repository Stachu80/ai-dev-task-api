import {Component, inject} from '@angular/core';
import {first, Observable, Subject, switchMap, tap} from "rxjs";
import {ApiService} from "../api.service";
import {AsyncPipe, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {BloggerService} from "./blogger.service";
import {BloggerType} from "./models/blogger.type";
import {Answer} from "../models/answer.type";

@Component({
  selector: 'app-blogger',
  standalone: true,
  imports: [
    UpperCasePipe,
    AsyncPipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './blogger.component.html',
  styleUrl: './blogger.component.scss'
})
export class BloggerComponent {
  api: ApiService = inject(ApiService);
  bloggerService: BloggerService = inject(BloggerService);
  taskName: string = 'blogger';
  getTask$: Subject<void> = new Subject();
  writeBlog$: Subject<BloggerType> = new Subject();
  isButtonGetTaskVisible: boolean = true;
  isCorrectInfo: Answer = {code: 0, msg: '', note: ''};

  task$: Observable<BloggerType> = this.getTask$.pipe(
    switchMap(() => this.bloggerService.getTask(this.taskName)),
    tap(() => this.isButtonGetTaskVisible = false)
  );

  blog$:Observable<string[]> = this.writeBlog$.pipe(
    switchMap((task:BloggerType) => this.bloggerService.writeBlog(task))
  )

  getTask = (): void => {
    this.getTask$.next()
  }

  writeBlog(task: BloggerType): void {
    this.writeBlog$.next(task);
  }

  sendAnswer(blog: string[]): void {
    this.bloggerService.sendAnswer(blog).pipe(
      first(),
      tap((data: Answer) => this.isCorrectInfo = data)
    ).subscribe();
  }
}
