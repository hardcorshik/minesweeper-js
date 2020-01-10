import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'minesweeper-js';

  public customX: number = 10;
  public customY: number = 10;
  public customMines: number = 10;
}
