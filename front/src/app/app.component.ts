import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Horseman } from 'node-horseman';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  horseman;

  constructor(){
    this.horseman = new Horseman();
  }

  title = 'La nueva app de Angular 4!!!';
  toggle = true;
  name: string = '';
  click() {

    this.horseman
    .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
    .open('http://www.google.com')
    .type('input[name="q"]', 'github')
    .click('[name="btnK"]')
    .keyboardEvent('keypress', 16777221)
    .waitForSelector('div.g')
    .count('div.g')
    .log() // prints out the number of results
    .close();

    this.name = 'reseteo';

    if (this.toggle) {
      this.title = 'Cambio de nombre!'
    } else {
      this.title = 'Otro Cambio de nombre!'
    }

    this.toggle = !this.toggle;
  }
}
