import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  public primaryColor: number;
  public secondaryColor: number;
  public allowAreaClear: boolean;

  constructor() { }

  ngOnInit() {
  }

  public save() {
    localStorage.setItem("primary-color", this.primaryColor.toString());
    localStorage.setItem("secondary-color", this.secondaryColor.toString());
    localStorage.setItem("allow-area-clear", this.allowAreaClear.toString());
  }

}
