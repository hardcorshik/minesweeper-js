import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDebug]'
})
export class DebugDirective {

  constructor() { }


  @Output() private codeEntered: EventEmitter<boolean> = new EventEmitter<boolean>();
  private sequence: string[] = [];
  private secret: string[] = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a", "Enter"];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key) {
      console.log(event.key);
      this.sequence.push(event.key);

      if (this.sequence.length > this.secret.length) {
        this.sequence.shift();
      }

      if (this.isKonamiCode()) {
        this.codeEntered.emit(true);
      }
      else {
        this.codeEntered.emit(false);
      }
    }
  }

  private isKonamiCode():boolean {
    let output = true;
    for (let i = 0; i < this.secret.length; i++) {
      if (this.secret[i] != this.sequence[i]) output = false;
    }
    return output;
  }
}
