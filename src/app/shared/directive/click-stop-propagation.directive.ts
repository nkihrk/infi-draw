import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickStopPropagation]'
})
export class ClickStopPropagationDirective {
  constructor() {}

  @HostListener('clickj', ['$event']) onClick($e: any): void {
    $e.stopPropagation();
  }
}
