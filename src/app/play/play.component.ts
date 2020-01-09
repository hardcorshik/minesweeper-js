import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CellStatus, ICell, IFieldParameters, IRow} from './field-interfaces';
import {FieldGenerator} from './field-generator';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {
  private setup: string;
  public x: number[] = [];
  public y: number[] = [];
  public field: IRow[] = [];

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.setup = params.get('params');
    });

    let params: IFieldParameters = this.getParameters(this.setup);

    this.field = FieldGenerator.generateField(params);
    console.log(this.field);
  }

  private getParameters(input: string): IFieldParameters {
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

  public onLeftClick(event: Event, cell: ICell) {
    if (cell.status != CellStatus.Hidden) return false;

    if (cell.mine) {
      this.lose(cell.x, cell.y);
      cell.status = CellStatus.Revealed;
    }
    else {
      cell.status = CellStatus.Revealed;
      cell.numberShown = this.calculateNumberShown(cell.x, cell.y);
    }
  }
  public onRightClick(event: Event, cell: ICell) {
    switch (cell.status) {
      case CellStatus.Hidden:
        cell.status = CellStatus.Marked;
        break;
      case CellStatus.Marked:
        cell.status = CellStatus.Question;
        break;
      case CellStatus.Question:
        cell.status = CellStatus.Hidden;
        break;
      case CellStatus.Revealed:
        break;
    }
    return false;
  }

  private lose(xin: number, yin: number) {
    alert("you bad (" + xin + "," + yin + ")");
  }

  private calculateNumberShown (xin: number, yin: number): number {
    let cellsToCheck: ICell[] = [];

    let topRow: IRow = this.field.find(x => x.rowNumber == yin - 1);
    let middleRow: IRow = this.field.find(x => x.rowNumber == yin);
    let bottomRow: IRow = this.field.find(x => x.rowNumber == yin + 1);
    console.log(topRow);

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

    console.log(cellsToCheck);
    let output: number = 0;
    cellsToCheck.forEach(cell => {
      if (cell && cell.mine) output++;
    });
    return output;
  }

}

const easy: IFieldParameters = { xl: 9, yl: 9, mines: 10 };
const normal: IFieldParameters = { xl: 16, yl: 16, mines: 40};
const hard: IFieldParameters = { xl: 24, yl: 24, mines: 99 };