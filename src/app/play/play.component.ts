import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CellStatus, ICell, IFieldParameters, IRow} from './field-interfaces';
import {FieldGenerator} from './field-generator';
import {timer} from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  private setup: string;
  private stopwatch;
  private stopwatchRunning: boolean = false;
  public field: IRow[] = [];
  public mineCounter: number;
  public timeCounter: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.setup = params.get('params');
      let genParams = PlayComponent.getParameters(this.setup);
      this.mineCounter = genParams.mines;
      this.timeCounter = 0;
      this.field = FieldGenerator.generateField(genParams);
    });
  }

  private static getParameters(input: string): IFieldParameters {
    switch (input) {
      case "easy": return easy;
      case "normal": return normal;
      case "hard": return hard;
      default:
        let params = input.split('&');

        return {
          xl: Number(params[0]),
          yl: Number(params[1]),
          mines: Number(params[2]),
        };
    }
  }

  // Left & Right Click Handlers
  public onLeftClick(allowArea: boolean, cell: ICell) {
    if (!this.stopwatchRunning) this.startStopwatch();
    if (cell.status != CellStatus.Hidden && !allowArea) return false;
    if (cell.status != CellStatus.Hidden && allowArea) {
      this.areaClear(cell);
      return false;
    }
    if (cell.mine) {
      this.lose(cell.x, cell.y);
      cell.status = CellStatus.Revealed;
    }
    else {
      cell.status = CellStatus.Revealed;
      cell.numberShown = this.calculateNumberShown(cell.x, cell.y);
      if (cell.numberShown == 0) this.onLeftClick(true, cell);
    }

    if (this.isVictory()) this.win();
  }
  public onRightClick(event: Event, cell: ICell) {
    switch (cell.status) {
      case CellStatus.Hidden:
        cell.status = CellStatus.Marked;
        this.mineCounter--;
        break;
      case CellStatus.Marked:
        cell.status = CellStatus.Question;
        this.mineCounter++;
        break;
      case CellStatus.Question:
        cell.status = CellStatus.Hidden;
        break;
      case CellStatus.Revealed:
        break;
    }
    return false;
  }
  public isHidden(cell: ICell) {
    return cell.status == CellStatus.Hidden;
  }
  public isFlag(cell: ICell) {
    return cell.status == CellStatus.Marked;
  }
  public isRevealed(cell: ICell) {
    return cell.status == CellStatus.Revealed;
  }
  public isQuestion(cell: ICell) {
    return cell.status == CellStatus.Question;
  }
  public newField() {
    if (this.stopwatch) this.stopStopwatch();
    this.ngOnInit();
  }

  // Used when player click on a mine - reveals all cells
  private lose(xin: number, yin: number) {
    this.field.forEach(row => {
      row.cells.forEach(cell => {
        cell.status = CellStatus.Revealed;
        if (cell.mine) return;
        cell.numberShown = this.calculateNumberShown(cell.x, cell.y);
      });
    });
    let userInput = confirm("Oh no, you clicked a mine. Restart?");
    if (userInput) this.ngOnInit();
    this.stopStopwatch();
  }
  // Calculates number shown on the cell
  private calculateNumberShown (xin: number, yin: number): number {
    let cellsToCheck = this.getNearbyCells(xin, yin);

    let output: number = 0;
    cellsToCheck.forEach(cell => {
      if (cell && cell.mine) output++;
    });
    return output;
  }
  // Clears surrounding cells if no unmarked mines are found
  private areaClear(cell: ICell): void {
    let cellsToCheck = this.getNearbyCells(cell.x, cell.y);
    if (cell.numberShown == 0) return cellsToCheck.forEach(cell => this.onLeftClick(false, cell));
    let numbers = cell.numberShown;
    cellsToCheck.forEach(cell => {
      if (cell.status == CellStatus.Marked) numbers--;
    });
    let allowClear: boolean = numbers == 0;
    if (allowClear) return cellsToCheck.forEach(cell => this.onLeftClick(false, cell));
  }
  // Finds all surrounding cells from the board
  private getNearbyCells(xin: number, yin: number): ICell[] {
    let cellsToCheck: ICell[] = [];

    let topRow: IRow = this.field.find(x => x.rowNumber == yin - 1);
    let middleRow: IRow = this.field.find(x => x.rowNumber == yin);
    let bottomRow: IRow = this.field.find(x => x.rowNumber == yin + 1);

    if (topRow) {
      cellsToCheck.push(topRow.cells.find(cell => cell.x == xin - 1));
      cellsToCheck.push(topRow.cells.find(cell => cell.x == xin));
      cellsToCheck.push(topRow.cells.find(cell => cell.x == xin + 1));
    }
    if (middleRow) {
      cellsToCheck.push(middleRow.cells.find(cell => cell.x == xin - 1));
      cellsToCheck.push(middleRow.cells.find(cell => cell.x == xin + 1));
    }
    if (bottomRow) {
      cellsToCheck.push(bottomRow.cells.find(cell => cell.x == xin - 1));
      cellsToCheck.push(bottomRow.cells.find(cell => cell.x == xin));
      cellsToCheck.push(bottomRow.cells.find(cell => cell.x == xin + 1));
    }

    return cellsToCheck.filter(item => item != undefined);
  }
  // Check for victory
  private isVictory(): boolean {
    return this.field.every(row => row.cells.every(cell => {
      return (!cell.mine && cell.status == CellStatus.Revealed) || (cell.mine && cell.status != CellStatus.Revealed);
    }));
  }
  // Win
  private win() {
    this.field.forEach(row => {
      row.cells.forEach(cell => cell.status = CellStatus.Revealed);
    });
    let userChoice = confirm("Congratulations! You won! Restart?");
    if (userChoice) this.ngOnInit();
    this.stopStopwatch();
  }
  // Stopwatch
  private startStopwatch() {
    this.stopwatchRunning = true;
    const source = timer(1000, 1000);
    this.stopwatch = source.subscribe(() => this.timeCounter++);
  }
  private stopStopwatch() {
    this.stopwatchRunning = false;
    this.stopwatch.unsubscribe();
  }
}

//Difficulty presents
const easy: IFieldParameters = { xl: 9, yl: 9, mines: 10 };
const normal: IFieldParameters = { xl: 16, yl: 16, mines: 40};
const hard: IFieldParameters = { xl: 24, yl: 24, mines: 99 };
