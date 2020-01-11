import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {
  public primaryColor: string;
  public secondaryColor: string;

  public overrideFlag: boolean;
  public flagColor: string;

  constructor() {
  }

  ngOnInit() {
    this.load();
  }

  public save() {
    localStorage.setItem('primary-color', this.primaryColor);
    localStorage.setItem('secondary-color', this.secondaryColor);
    if (this.overrideFlag) {
      localStorage.setItem('flag-color', this.flagColor);
      localStorage.setItem('flag-override', '1');
    } else {
      localStorage.setItem('flag-color', this.secondaryColor);
    }
  }

  public load() {
    this.primaryColor = localStorage.getItem('primary-color') || '#808080';
    this.secondaryColor = localStorage.getItem('secondary-color') || '#FFFFFF';
    if (localStorage.getItem('flag-override')) {
      this.overrideFlag = true;
      this.flagColor = localStorage.getItem('flag-color');
    } else {
      this.overrideFlag = false;
      this.flagColor = this.secondaryColor;
    }
  }

}
