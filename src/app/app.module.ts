import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayComponent } from './play/play.component';
import { RouterModule } from '@angular/router';
import {FormsModule} from '@angular/forms';
import { PreferencesComponent } from './preferences/preferences.component';
import { DebugDirective } from './directives/debug.directive';

@NgModule({
  declarations: [
    AppComponent,
    PlayComponent,
    PreferencesComponent,
    DebugDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {path: 'play/:params', component: PlayComponent},
      {path: 'options', component: PreferencesComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
