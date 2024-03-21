import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule} from "@angular/common/http";
import {first, switchMap, tap} from "rxjs";
import {ApiService} from "./api.service";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{

  constructor(private api:ApiService) {

  }

  getTask() {
    let temp = ''
    this.api.getToken().pipe(
      first(),
      switchMap((data) => {
        temp = data.token
        return this.api.getTask(data.token)
      }),
      tap((task) => console.log(task)),
      switchMap((data) => this.api.sendAnswer(temp,data.cookie)),
    ).subscribe((data) => {

      console.log("task", data);
    })

  }
}
