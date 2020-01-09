export interface IFieldParameters {
  xl: number;
  yl: number;
  mines: number;
}

export interface ICell {
  x: number;
  y: number;
  mine: boolean;
  status: CellStatus;
  numberShown: number;
}

export interface IRow {
  cells: ICell[];
  rowNumber: number;
}

export enum CellStatus {
  Hidden,
  Revealed,
  Marked,
  Question
}
