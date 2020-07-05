import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LibService {
  constructor() {}

  f2i($num: number): number {
    let rounded: number = (0.5 + $num) | 0;
    rounded = ~~(0.5 + $num);
    rounded = (0.5 + $num) << 0;

    return rounded;
  }
}
