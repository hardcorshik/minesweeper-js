import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[appDebug]'
})
export class DebugDirective {

  constructor() { }


  @Output() private codeEnter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() private codeExit: EventEmitter<boolean> = new EventEmitter<boolean>();
  private sequence: string[] = [];
  private secret: string[] = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a", "Enter"];

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key) {
      this.sequence.push(event.key);

      if (this.sequence.length > this.secret.length) {
        this.sequence.shift();
      }

      if (this.isKonamiCode()) {
        this.codeEnter.emit(true);
      }
      else {
        this.codeEnter.emit(false);
      }

      if (this.isExitCode(event.key)) {
        this.codeExit.emit(true);
      } else {
        this.codeExit.emit(false);
      }
    }
  }

  private isKonamiCode(): boolean {
    return this.sequence.every((element, index) => { return element == this.secret[index]; });
  }
  private isExitCode(key: string): boolean {
    return key == "Pause";
  }
}
