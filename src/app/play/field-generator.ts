import { CellStatus, ICell, IFieldParameters, IRow } from './field-interfaces';

export class FieldGenerator {

  public static generateField(params: IFieldParameters): IRow[] {
    let minesLeft = params.mines;
    let cellsLeft = params.xl * params.yl;
    let field: IRow[] = [];

    for (let i = 0; i < params.yl; i++) {
      let row: IRow = { cells: [], rowNumber: i };

      for (let j = 0; j < params.xl; j++) {
        let currentCell: ICell = this.generateCell(j, i, minesLeft, cellsLeft);
        cellsLeft--;
        if (currentCell.mine) minesLeft--;

        row.cells.push(currentCell);
      }

      field.push(row);
    }

    return field;
  }

  public static generateCell(x: number, y: number, minesLeft: number, cellsLeft: number): ICell {
    let random = Math.random();
    let passLimit = minesLeft / cellsLeft;
    let isMine: boolean = random <= passLimit;
    let numberShown = 0;
    if (isMine) numberShown = 99;
    return {
      x: x,
      y: y,
      mine: isMine,
      status: CellStatus.Hidden,
      numberShown: numberShown
    };
  }

}
